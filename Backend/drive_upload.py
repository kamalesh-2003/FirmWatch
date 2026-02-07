import io
import os
import time
from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

load_dotenv()

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {".pdf"}
SCOPES = ["https://www.googleapis.com/auth/drive.file"]
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
GOOGLE_OAUTH_TOKEN_PATH = os.getenv(
    "GOOGLE_OAUTH_TOKEN_PATH", os.path.join(os.path.dirname(__file__), "drive_oauth_token.json")
)
GOOGLE_OAUTH_REDIRECT_URI = os.getenv(
    "GOOGLE_OAUTH_REDIRECT_URI", "http://127.0.0.1:5000/auth/google-drive/callback"
)
OAUTH_ALLOW_INSECURE = os.getenv("OAUTH_ALLOW_INSECURE", "").lower() in {"1", "true", "yes"}

OAUTH_STATE = {"state": None}

DEMO_VENDOR_MAP = [
    ("apex", "Apex Logistics"),
    ("nova", "Nova Consulting"),
    ("zenith", "Zenith Office Supply"),
    ("harbor", "Harbor Tech"),
]


def get_drive_service():
    if not GOOGLE_OAUTH_CLIENT_SECRET:
        raise ValueError("GOOGLE_OAUTH_CLIENT_SECRET is not set")

    creds = None
    if os.path.exists(GOOGLE_OAUTH_TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(GOOGLE_OAUTH_TOKEN_PATH, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(GOOGLE_OAUTH_TOKEN_PATH, "w") as token_file:
                token_file.write(creds.to_json())
        else:
            raise ValueError("Google Drive is not authorized. Visit /auth/google-drive to connect.")

    return build("drive", "v3", credentials=creds)


def analyze_statement(file_name):
    base_name = os.path.basename(file_name).lower()
    vendor = "Apex Logistics"
    for token, label in DEMO_VENDOR_MAP:
        if token in base_name:
            vendor = label
            break

    high_risk = any(token in base_name for token in ["fraud", "hold", "high", "suspicious"])
    amount = 48900 if high_risk else 12450
    risk = "HIGH" if high_risk else "MEDIUM"
    status = "HOLD" if high_risk else "Processing"

    reasons = [
        "Vendor not found in approved list",
        "Amount exceeds historical average by 240%",
        "Policy threshold violation detected",
    ]
    if not high_risk:
        reasons = [
            "Vendor match found but requires review",
            "Amount slightly above monthly average",
            "Policy threshold near limit",
        ]

    return {
        "risk": risk,
        "status": status,
        "vendor": vendor,
        "amount": amount,
        "currency": "USD",
        "reasons": reasons,
    }


@app.route("/upload-statement", methods=["POST"])
def upload_statement():
    upload_file = request.files.get("file")
    if not upload_file or not upload_file.filename:
        return jsonify({"error": "PDF file is required"}), 400

    _, ext = os.path.splitext(upload_file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Only PDF files are allowed"}), 400

    file_name = secure_filename(upload_file.filename)
    timestamped_name = f"{int(time.time())}_{file_name}"

    try:
        drive_service = get_drive_service()
        file_metadata = {"name": timestamped_name}
        if GOOGLE_DRIVE_FOLDER_ID:
            file_metadata["parents"] = [GOOGLE_DRIVE_FOLDER_ID]

        media_body = MediaIoBaseUpload(
            io.BytesIO(upload_file.read()),
            mimetype="application/pdf",
            resumable=False,
        )

        created = (
            drive_service.files()
            .create(body=file_metadata, media_body=media_body, fields="id,webViewLink")
            .execute()
        )
    except Exception as exc:
        return jsonify({"error": f"Drive upload failed: {exc}"}), 500

    analysis = analyze_statement(file_name)
    return jsonify(
        {
            "success": True,
            "message": f'PDF "{file_name}" uploaded to Google Drive.',
            "driveFileId": created.get("id"),
            "driveViewLink": created.get("webViewLink"),
            "analysis": analysis,
        }
    )


@app.route("/auth/google-drive", methods=["GET"])
def auth_google_drive():
    if not GOOGLE_OAUTH_CLIENT_SECRET:
        return jsonify({"error": "GOOGLE_OAUTH_CLIENT_SECRET is not set"}), 500

    if OAUTH_ALLOW_INSECURE:
        os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    flow = InstalledAppFlow.from_client_secrets_file(
        GOOGLE_OAUTH_CLIENT_SECRET,
        scopes=SCOPES,
        redirect_uri=GOOGLE_OAUTH_REDIRECT_URI,
    )
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    OAUTH_STATE["state"] = state
    return redirect(auth_url)


@app.route("/auth/google-drive/callback", methods=["GET"])
def auth_google_drive_callback():
    if not GOOGLE_OAUTH_CLIENT_SECRET:
        return jsonify({"error": "GOOGLE_OAUTH_CLIENT_SECRET is not set"}), 500

    if OAUTH_ALLOW_INSECURE:
        os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    flow = InstalledAppFlow.from_client_secrets_file(
        GOOGLE_OAUTH_CLIENT_SECRET,
        scopes=SCOPES,
        redirect_uri=GOOGLE_OAUTH_REDIRECT_URI,
    )
    if OAUTH_STATE["state"]:
        flow.state = OAUTH_STATE["state"]

    flow.fetch_token(authorization_response=request.url)
    creds = flow.credentials

    with open(GOOGLE_OAUTH_TOKEN_PATH, "w") as token_file:
        token_file.write(creds.to_json())

    return (
        "Google Drive connected. You can close this tab and upload a PDF from the dashboard.",
        200,
    )


@app.route("/auth/google-drive/status", methods=["GET"])
def auth_google_drive_status():
    if not os.path.exists(GOOGLE_OAUTH_TOKEN_PATH):
        return jsonify({"authorized": False})

    creds = Credentials.from_authorized_user_file(GOOGLE_OAUTH_TOKEN_PATH, SCOPES)
    if not creds:
        return jsonify({"authorized": False})

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(GOOGLE_OAUTH_TOKEN_PATH, "w") as token_file:
                token_file.write(creds.to_json())
        else:
            return jsonify({"authorized": False})

    return jsonify({"authorized": True})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
