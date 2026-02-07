"""FastAPI server connecting Composio Gmail + OpenRouter analysis to the frontend."""

import os
import json
import uuid
import logging
import tempfile
from datetime import datetime
from collections import Counter

import httpx
import pdfplumber
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from composio import Composio

from storage import load_data, save_data

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FirWatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Composio setup (reuses the same user id as agent.py)
# ---------------------------------------------------------------------------
COMPOSIO_API_KEY = os.getenv("COMPOSIO_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Lazy-init Composio so the server starts instantly
_composio = None

def get_composio():
    global _composio
    if _composio is None:
        logger.info("Initializing Composio client...")
        _composio = Composio()
        # Ensure Gmail is authorized for this user
        session = _composio.create(user_id="kamalesh")
        try:
            session.authorize("gmail")
        except Exception:
            pass
        logger.info("Composio client ready.")
    return _composio


# ---------------------------------------------------------------------------
# Helper: call OpenRouter for risk analysis
# ---------------------------------------------------------------------------
ANALYSIS_PROMPT = """You are a financial fraud analyst AI. Analyze the following email and determine if it may be a fraudulent or suspicious invoice.

EMAIL SUBJECT: {subject}
EMAIL FROM: {sender}
EMAIL DATE: {date}
EMAIL BODY:
{body}

Respond ONLY with valid JSON (no markdown, no extra text) in this exact structure:
{{
  "riskScore": <integer 0-100>,
  "riskLevel": "<LOW|MEDIUM|HIGH>",
  "reason": "<one-line reason>",
  "flags": ["<flag1>", "<flag2>"],
  "summary": "<2-3 sentence analysis>",
  "amount": <number or null if no dollar amount found>,
  "factors": [
    {{
      "title": "<factor name>",
      "severity": "<high|medium|low>",
      "description": "<explanation>"
    }}
  ]
}}"""


async def analyze_email(subject: str, sender: str, date: str, body: str) -> dict:
    """Send an email to OpenRouter for fraud risk analysis."""
    prompt = ANALYSIS_PROMPT.format(
        subject=subject, sender=sender, date=date, body=body
    )
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "anthropic/claude-sonnet-4",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            },
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]

        # Strip markdown fences if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
        if content.endswith("```"):
            content = content.rsplit("```", 1)[0]
        content = content.strip()

        return json.loads(content)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/dashboard/summary")
async def dashboard_summary():
    data = load_data()
    return data.get("summary", {
        "totalInvoices": 0,
        "highRiskAlerts": 0,
        "flaggedAmount": 0,
        "casesResolved": 0,
    })


@app.get("/api/alerts")
async def get_alerts():
    data = load_data()
    return data.get("alerts", [])


@app.get("/api/risk-distribution")
async def risk_distribution():
    data = load_data()
    alerts = data.get("alerts", [])
    counts = Counter(a.get("riskLevel", "LOW") for a in alerts)
    return {
        "low": counts.get("LOW", 0),
        "medium": counts.get("MEDIUM", 0),
        "high": counts.get("HIGH", 0),
    }


@app.get("/api/alerts-over-time")
async def alerts_over_time():
    data = load_data()
    alerts = data.get("alerts", [])
    day_counts: dict[str, int] = {}
    for a in alerts:
        date_str = a.get("date", "")
        if date_str:
            try:
                dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                day_name = dt.strftime("%a")
            except (ValueError, TypeError):
                day_name = "Unknown"
        else:
            day_name = "Unknown"
        day_counts[day_name] = day_counts.get(day_name, 0) + 1

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return [{"date": d, "count": day_counts.get(d, 0)} for d in days]


@app.get("/api/top-anomalies")
async def top_anomalies():
    data = load_data()
    alerts = data.get("alerts", [])
    flag_counter: Counter = Counter()
    for a in alerts:
        for flag in a.get("flags", []):
            flag_counter[flag] += 1
    return [{"type": t, "count": c} for t, c in flag_counter.most_common(10)]


@app.get("/api/investigation-case")
async def investigation_case():
    data = load_data()
    alerts = data.get("alerts", [])
    if not alerts:
        return None
    highest = max(alerts, key=lambda a: a.get("riskScore", 0))
    similar = [
        {"caseId": a["id"], "status": a.get("status", "New Alert")}
        for a in alerts
        if a["id"] != highest["id"] and a.get("riskLevel") == highest.get("riskLevel")
    ][:3]
    return {
        "caseId": highest["id"],
        "riskScore": highest.get("riskScore", 0),
        "riskLevel": highest.get("riskLevel", "LOW"),
        "vendor": highest.get("vendor", "Unknown"),
        "amount": highest.get("amount", 0) or 0,
        "flags": highest.get("flags", []),
        "similarCases": similar,
    }


@app.get("/api/pattern-insights")
async def pattern_insights():
    data = load_data()
    alerts = data.get("alerts", [])
    insights = []
    if not alerts:
        return insights

    high_count = sum(1 for a in alerts if a.get("riskLevel") == "HIGH")
    if high_count:
        insights.append({
            "id": "insight-1",
            "text": f"{high_count} high-risk alert(s) detected across scanned invoices.",
        })

    vendors = Counter(a.get("vendor", "Unknown") for a in alerts)
    top_vendor, top_count = vendors.most_common(1)[0]
    if top_count > 1:
        insights.append({
            "id": "insight-2",
            "text": f"Vendor \"{top_vendor}\" appears in {top_count} alerts — possible repeat offender.",
        })

    flag_counter: Counter = Counter()
    for a in alerts:
        for f in a.get("flags", []):
            flag_counter[f] += 1
    if flag_counter:
        top_flag, flag_count = flag_counter.most_common(1)[0]
        insights.append({
            "id": "insight-3",
            "text": f"Most common flag: \"{top_flag}\" (seen {flag_count} time(s)).",
        })

    return insights


@app.get("/api/top-risk-vendors")
async def top_risk_vendors():
    data = load_data()
    alerts = data.get("alerts", [])
    vendor_counts = Counter(a.get("vendor", "Unknown") for a in alerts)
    return [
        {"vendor": v, "alertCount": c}
        for v, c in vendor_counts.most_common(10)
    ]


@app.get("/api/report/{alert_id}")
async def report_analysis(alert_id: str):
    data = load_data()
    alerts = data.get("alerts", [])
    alert = next((a for a in alerts if a["id"] == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    risk_level = alert.get("riskLevel", "LOW")
    similar = [
        {"caseId": a["id"], "status": a.get("status", "New Alert")}
        for a in alerts
        if a["id"] != alert_id and a.get("riskLevel") == risk_level
    ][:3]

    return {
        "alert": {
            "id": alert["id"],
            "riskScore": alert.get("riskScore", 0),
            "type": alert.get("type", "Invoice"),
            "vendor": alert.get("vendor", "Unknown"),
            "amount": alert.get("amount"),
            "reason": alert.get("reason", ""),
            "status": alert.get("status", "New Alert"),
        },
        "riskScore": alert.get("riskScore", 0),
        "riskLevel": risk_level,
        "summary": alert.get("summary", ""),
        "factors": alert.get("factors", []),
        "flags": alert.get("flags", []),
        "similarCases": similar,
    }


# ---------------------------------------------------------------------------
# Core pipeline: sync email
# ---------------------------------------------------------------------------

@app.post("/api/sync-email")
async def sync_email():
    """Fetch invoice emails via Composio, analyze with OpenRouter, save alerts."""
    logger.info("Starting email sync...")

    # 1. Fetch emails using Composio
    try:
        composio_client = get_composio()
        result = composio_client.tools.execute(
            slug="GMAIL_FETCH_EMAILS",
            arguments={"query": "subject:invoice", "max_results": 20},
            user_id="kamalesh",
            dangerously_skip_version_check=True,
        )
        logger.info(f"Composio result successful: {result.get('successful')}")
        logger.info(f"Composio result data type: {type(result.get('data'))}")
        logger.info(f"Composio result: {result}")
        if result.get("error"):
            raise Exception(result["error"])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Composio GMAIL_FETCH_EMAILS failed: {e}")
        raise HTTPException(status_code=502, detail=f"Gmail fetch failed: {e}")

    # Parse emails from Composio response
    # result is a dict with keys: data, error, successful
    raw_data = result.get("data", {})
    emails = []
    if isinstance(raw_data, list):
        emails = raw_data
    elif isinstance(raw_data, dict):
        emails = (
            raw_data.get("emails")
            or raw_data.get("messages")
            or raw_data.get("data")
            or raw_data.get("threads")
            or []
        )
        if isinstance(emails, dict):
            emails = []
    # Fallback: check top-level keys
    if not emails:
        if isinstance(result.get("emails"), list):
            emails = result["emails"]
        elif isinstance(result.get("messages"), list):
            emails = result["messages"]

    logger.info(f"Parsed {len(emails)} email(s) from Composio response")

    # 2. Deduplicate
    data = load_data()
    processed_ids = set(data.get("processed_email_ids", []))
    new_emails = []
    for email in emails:
        eid = (
            email.get("id")
            or email.get("messageId")
            or email.get("message_id")
            or email.get("threadId")
            or str(uuid.uuid4())
        )
        if eid not in processed_ids:
            email["_eid"] = eid
            new_emails.append(email)

    logger.info(f"{len(new_emails)} new email(s) to process")

    if not new_emails:
        return {"success": True, "message": "No new invoice emails found.", "processed": 0}

    # 3. Analyze each email with OpenRouter
    processed_count = 0
    for email in new_emails:
        subject = email.get("subject", email.get("Subject", "No subject"))
        sender = (
            email.get("from")
            or email.get("sender")
            or email.get("From")
            or "Unknown"
        )
        date = (
            email.get("date")
            or email.get("Date")
            or email.get("receivedAt")
            or datetime.utcnow().isoformat()
        )
        body = (
            email.get("body")
            or email.get("snippet")
            or email.get("text")
            or email.get("Body")
            or email.get("preview")
            or ""
        )

        try:
            analysis = await analyze_email(subject, sender, date, body)
        except Exception as e:
            logger.error(f"OpenRouter analysis failed for '{subject}': {e}")
            analysis = {
                "riskScore": 50,
                "riskLevel": "MEDIUM",
                "reason": "Analysis failed — flagged for manual review",
                "flags": ["analysis_error"],
                "summary": f"Automated analysis failed: {e}",
                "amount": None,
                "factors": [],
            }

        # Extract vendor name from sender
        vendor = sender
        if "<" in vendor:
            vendor = vendor.split("<")[0].strip()
        if not vendor:
            vendor = "Unknown"

        alert_id = f"alert-{uuid.uuid4().hex[:8]}"
        factors = []
        for f in analysis.get("factors", []):
            factors.append({
                "id": f"factor-{uuid.uuid4().hex[:6]}",
                "title": f.get("title", "Unknown"),
                "severity": f.get("severity", "medium"),
                "description": f.get("description", ""),
            })

        alert = {
            "id": alert_id,
            "emailId": email["_eid"],
            "riskScore": analysis.get("riskScore", 0),
            "riskLevel": analysis.get("riskLevel", "LOW"),
            "type": "Invoice",
            "vendor": vendor,
            "amount": analysis.get("amount"),
            "reason": analysis.get("reason", ""),
            "flags": analysis.get("flags", []),
            "summary": analysis.get("summary", ""),
            "factors": factors,
            "status": "New Alert",
            "date": date,
        }

        data["alerts"].append(alert)
        data.setdefault("processed_email_ids", []).append(email["_eid"])
        processed_count += 1
        logger.info(f"Processed: {subject} -> risk={analysis.get('riskLevel')}")

    # 4. Save (auto-recomputes summary)
    save_data(data)
    logger.info(f"Sync complete. {processed_count} new alert(s) saved.")

    return {
        "success": True,
        "message": f"Processed {processed_count} new invoice email(s).",
        "processed": processed_count,
    }


# ---------------------------------------------------------------------------
# Transaction analysis from income statement PDFs
# ---------------------------------------------------------------------------

TRANSACTION_ANALYSIS_PROMPT = """You are a financial fraud analyst AI. Analyze the following income statement text extracted from a PDF and identify any suspicious or risky transactions.

Look for:
- Unusually large or round-number expenses
- Payments to unknown or suspicious vendors
- Duplicate or near-duplicate entries
- Expenses inconsistent with the business type
- Irregular timing patterns
- Potential embezzlement, kickbacks, or money laundering indicators

INCOME STATEMENT TEXT:
{text}

Respond ONLY with valid JSON (no markdown, no extra text) — an array of suspicious transactions:
[
  {{
    "riskScore": <integer 0-100>,
    "riskLevel": "<LOW|MEDIUM|HIGH>",
    "reason": "<one-line reason>",
    "flags": ["<flag1>", "<flag2>"],
    "summary": "<2-3 sentence analysis>",
    "amount": <number or null>,
    "vendor": "<vendor/entity name or 'Unknown'>",
    "factors": [
      {{
        "title": "<factor name>",
        "severity": "<high|medium|low>",
        "description": "<explanation>"
      }}
    ]
  }}
]

If no suspicious transactions are found, return an empty array: []"""


async def analyze_transactions(text: str) -> list[dict]:
    """Send income statement text to OpenRouter for transaction risk analysis."""
    prompt = TRANSACTION_ANALYSIS_PROMPT.format(text=text)
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "anthropic/claude-sonnet-4",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            },
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]

        # Strip markdown fences if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
        if content.endswith("```"):
            content = content.rsplit("```", 1)[0]
        content = content.strip()

        return json.loads(content)


@app.post("/api/upload-statement")
async def upload_statement(file: UploadFile = File(...)):
    """Upload an income statement PDF, analyze transactions, save alerts."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    logger.info(f"Received income statement upload: {file.filename}")

    # 1. Save to temp file and extract text with pdfplumber
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        text = ""
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        logger.error(f"PDF text extraction failed: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")

    logger.info(f"Extracted {len(text)} chars from {file.filename}")

    # 2. Analyze with OpenRouter
    try:
        flagged = await analyze_transactions(text)
    except Exception as e:
        logger.error(f"Transaction analysis failed: {e}")
        raise HTTPException(status_code=502, detail=f"Analysis failed: {e}")

    if not isinstance(flagged, list):
        flagged = []

    # 3. Create alerts
    data = load_data()
    processed_count = 0

    for txn in flagged:
        alert_id = f"alert-{uuid.uuid4().hex[:8]}"
        factors = []
        for f in txn.get("factors", []):
            factors.append({
                "id": f"factor-{uuid.uuid4().hex[:6]}",
                "title": f.get("title", "Unknown"),
                "severity": f.get("severity", "medium"),
                "description": f.get("description", ""),
            })

        alert = {
            "id": alert_id,
            "riskScore": txn.get("riskScore", 0),
            "riskLevel": txn.get("riskLevel", "LOW"),
            "type": "Transaction",
            "vendor": txn.get("vendor", "Unknown"),
            "amount": txn.get("amount"),
            "reason": txn.get("reason", ""),
            "flags": txn.get("flags", []),
            "summary": txn.get("summary", ""),
            "factors": factors,
            "status": "New Alert",
            "date": datetime.utcnow().isoformat(),
            "source": file.filename,
        }

        data["alerts"].append(alert)
        processed_count += 1
        logger.info(f"Transaction alert: {txn.get('vendor', 'Unknown')} -> risk={txn.get('riskLevel')}")

    # 4. Save
    save_data(data)
    logger.info(f"Upload complete. {processed_count} transaction alert(s) saved.")

    return {
        "success": True,
        "message": f"Processed {processed_count} suspicious transaction(s) from {file.filename}.",
        "processed": processed_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
