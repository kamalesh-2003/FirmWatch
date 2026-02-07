import asyncio
from dotenv import load_dotenv
from claude_agent_sdk.client import ClaudeSDKClient
from claude_agent_sdk.types import (
    ClaudeAgentOptions,
    AssistantMessage,
    TextBlock,
    ToolUseBlock,
)
from composio import Composio

load_dotenv()

# Initialize Composio
composio = Composio()

# Create a session for your user
user_id = "kamalesh"
session = composio.create(user_id=user_id)

# Connect Gmail
print("Connecting Gmail...")
try:
    connection = session.authorize("gmail")
    if hasattr(connection, "url") and connection.url:
        print(f"\nPlease authenticate Gmail by visiting:\n{connection.url}\n")
        input("Press Enter after you've completed authentication...")
    else:
        print("Gmail already connected!")
except Exception as e:
    print(f"Gmail connection status: {e}")
    print("The agent will prompt you to connect during conversation if needed.")

# Connect Google Sheets
print("Connecting Google Sheets...")
try:
    sheets_connection = session.authorize("googlesheets")
    if hasattr(sheets_connection, "url") and sheets_connection.url:
        print(f"\nPlease authenticate Google Sheets by visiting:\n{sheets_connection.url}\n")
        input("Press Enter after you've completed authentication...")
    else:
        print("Google Sheets already connected!")
except Exception as e:
    print(f"Google Sheets connection status: {e}")
    print("The agent will prompt you to connect during conversation if needed.")

# Connect Google Drive
print("Connecting Google Drive...")
try:
    drive_connection = session.authorize("googledrive")
    if hasattr(drive_connection, "url") and drive_connection.url:
        print(f"\nPlease authenticate Google Drive by visiting:\n{drive_connection.url}\n")
        input("Press Enter after you've completed authentication...")
    else:
        print("Google Drive already connected!")
except Exception as e:
    print(f"Google Drive connection status: {e}")
    print("The agent will prompt you to connect during conversation if needed.")

print()

# Composio MCP server
options = ClaudeAgentOptions(
    system_prompt=(
        "You are a helpful finance assistant with access to Gmail, Google Sheets, and Google Drive tools. "
        "Always use the available tools to complete user requests. "
        "You can search, read, and manage emails using Gmail tools. "
        "You can create, read, update, and manage spreadsheets using Google Sheets tools. "
        "You can list, search, upload, download, and manage files and folders using Google Drive tools. "
        "When searching emails, use GMAIL_FETCH_EMAILS with the query parameter "
        "which supports Gmail search syntax (e.g. 'from:someone subject:invoice')."
    ),
    mcp_servers={
        "composio": {
            "type": "http",
            "url": session.mcp.url,
            "headers": session.mcp.headers,
        }
    },
    permission_mode="bypassPermissions",
)


async def main():
    print("""
Agent ready
""")

    async with ClaudeSDKClient(options) as client:
        initial_task = (
            "Search my Gmail for emails from Nithin Anumula that contain "
            "the keyword 'invoice'. Show me the sender, subject, date, "
            "and a brief summary of each email found."
        )
        print(f"You: {initial_task}")
        print("\nClaude: ", end="", flush=True)
        try:
            await client.query(initial_task)
            async for msg in client.receive_response():
                if isinstance(msg, AssistantMessage):
                    for block in msg.content:
                        if isinstance(block, ToolUseBlock):
                            print(f"\n[Using tool: {block.name}]", end="")
                        elif isinstance(block, TextBlock):
                            print(block.text, end="", flush=True)
            print()
        except Exception as e:
            print(f"\n[Error]: {e}")

        
        while True:
            user_input = input("\nYou: ").strip()
            if user_input.lower() == "exit":
                break

            print("\nClaude: ", end="", flush=True)
            try:
                await client.query(user_input)
                async for msg in client.receive_response():
                    if isinstance(msg, AssistantMessage):
                        for block in msg.content:
                            if isinstance(block, ToolUseBlock):
                                print(f"\n[Using tool: {block.name}]", end="")
                            elif isinstance(block, TextBlock):
                                print(block.text, end="", flush=True)
                print()
            except Exception as e:
                print(f"\n[Error]: {e}")


if __name__ == "__main__":
    asyncio.run(main())
