# FirmWatch

**Intelligent Invoice Fraud Detection and Financial Monitoring Platform**

Built at [TartanHacks 2026](https://tartanhacks.com) -- Carnegie Mellon University's flagship hackathon. FirmWatch won the **BNY Mellon Bank Track** for its approach to corporate financial security using agentic AI.

---

## About

FirmWatch is a real-time fraud detection dashboard that helps corporations protect themselves from invoice fraud and monitor how their money moves across accounts. It combines email intelligence, bank statement analysis, and AI-powered risk scoring into a single operational view.

The platform connects directly to a company's Gmail inbox through Composio's agent builder and MCP (Model Context Protocol) infrastructure, autonomously fetching invoice-related emails, deduplicating them against previously processed records, and routing each one through a Claude-powered analysis pipeline. Every email is scored for fraud risk, flagged with specific indicators, and surfaced in a dashboard that finance teams can act on immediately.

Beyond email, FirmWatch parses bank statement PDFs and performs baseline-comparison analysis. It ingests months of historical transaction data to establish normal business patterns -- recurring vendors, typical expense ranges, payment timing -- and then flags deviations in the most recent period. This catches things that email scanning alone would miss: offshore wire transfers that never appeared before, structured ATM withdrawals designed to avoid reporting thresholds, cryptocurrency exchange purchases on a business account, luxury goods spending, and transfers to personal accounts.

The result is a system where corporate finance teams get a complete picture of their exposure. They see which invoices look suspicious and why, which transactions broke from historical norms, which vendors appear most frequently in flagged alerts, and what patterns are emerging across all their data.

## How It Works

### Agentic Email Pipeline

FirmWatch uses Composio's agent builder to establish authenticated access to Gmail. The Composio integration handles OAuth, session management, and tool execution through MCP, which means the system can autonomously query the inbox without manual credential handling. When a sync is triggered:

1. Composio executes `GMAIL_FETCH_EMAILS` with invoice-targeted search queries
2. The server deduplicates incoming emails against a persistent list of already-processed message IDs
3. Each new email is sent to Claude (via OpenRouter) with a structured analysis prompt that extracts risk scores, risk levels, flags, and detailed factor breakdowns
4. Results are saved as alerts with full provenance -- the original email ID, extracted vendor name, dollar amounts, and the AI's reasoning

### Bank Statement Analysis

FirmWatch reads bank statement PDFs using pdfplumber, parsing transaction dates, descriptions, debits, credits, and running balances from structured PDF text. The system supports multi-month analysis:

- **Months 1-5** serve as the behavioral baseline representing normal business operations
- **Month 6** is the current period under review

The AI compares Month 6 against the baseline and flags anomalies: new vendors, spending spikes, offshore transfers, cryptocurrency purchases, ATM structuring, luxury goods, personal account transfers, and balance overdrafts. Each flagged transaction gets a risk score, detailed explanation, and comparison to historical patterns.

### Dashboard

The React frontend provides:

- **Top Metrics** -- total alerts, high-risk count, and resolution status at a glance
- **Bank Statements** -- month-by-month transaction tables with opening/closing balances, parsed directly from PDFs
- **Risk Distribution** -- pie chart breakdown of LOW, MEDIUM, and HIGH risk alerts
- **Alerts Over Time** -- line chart showing alert frequency by day of week
- **Top Anomalies** -- bar chart of the most common fraud flags across all alerts
- **Alert Queue** -- tabbed table separating Invoice alerts from Transaction alerts, each with risk scores, vendor info, amounts, and drill-down links
- **Investigation Details** -- deep-dive panel for the highest-risk case with similar case cross-references
- **Pattern Insights** -- AI-derived observations about repeat offenders, common flags, and high-risk concentrations
- **Top Risk Vendors** -- ranked list of vendors appearing most frequently in alerts
- **Report Analysis** -- per-alert detail page showing the full risk breakdown, all contributing factors, flags, and similar cases

### Composio Agent (CLI)

A standalone CLI agent (`agent.py`) provides interactive access to Gmail, Google Sheets, and Google Drive through Composio's MCP server. This is the original conversational interface that predates the web dashboard and can be used for ad-hoc investigation and data retrieval.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Recharts, React Router 6 |
| Backend | Python, FastAPI, Uvicorn |
| AI Analysis | Claude Sonnet (via OpenRouter API) |
| Email Integration | Composio Agent Builder with MCP |
| PDF Parsing | pdfplumber |
| Data Storage | JSON file with thread-safe read/write (storage.py) |

---

## Project Structure

```
firwatch-tools/
  Backend/
    server.py           # FastAPI server, all API endpoints, sync + analysis pipelines
    storage.py          # Thread-safe JSON file storage with auto-recomputed summaries
    agent.py            # Standalone CLI agent (Composio + Claude Agent SDK)
    data.json           # Persistent alert and email tracking data
    requirements.txt    # Python dependencies
    .env                # API keys (COMPOSIO_API_KEY, OPENROUTER_API_KEY)
  frontend/
    src/
      pages/
        Dashboard.jsx         # Main dashboard page
        ReportAnalysis.jsx    # Per-alert detail page
      components/
        charts/               # RiskDistribution, AlertsOverTime, TopAnomalies
        dashboard/            # TopMetrics
        panels/               # InvestigationDetails, PatternInsights, TopRiskVendors
        tables/               # AlertQueue, BankStatements
        chat/                 # ChatBot (assistant interface)
      contexts/
        ThemeContext.jsx       # Light/dark mode with localStorage persistence
      hooks/
        useDashboardData.ts   # Central data hook, fetches all endpoints in parallel
      services/
        api.ts                # Typed API service layer
    vite.config.js            # Vite config with /api proxy to backend
    package.json
    tailwind.config.js
  statement_month_1.pdf       # Bank statement PDFs (months 1-6)
  statement_month_2.pdf
  statement_month_3.pdf
  statement_month_4.pdf
  statement_month_5.pdf
  statement_month_6.pdf
```

---

## Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **Composio account** with Gmail authorized for your user
- **OpenRouter API key** with access to `anthropic/claude-sonnet-4`

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/firwatch-tools.git
cd firwatch-tools
```

### 2. Configure environment variables

Create `Backend/.env` with your API keys:

```
COMPOSIO_API_KEY=your_composio_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Install backend dependencies

```bash
cd Backend
python -m venv ../.venv
# Windows
..\.venv\Scripts\activate
# macOS/Linux
source ../.venv/bin/activate

pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Place bank statement PDFs

Put your bank statement PDFs in the project root as `statement_month_1.pdf` through `statement_month_6.pdf`. The system treats months 1-5 as baseline and month 6 as the period under review.

---

## Running the Application

You need two terminals running simultaneously.

### Terminal 1 -- Backend

```bash
cd Backend
..\.venv\Scripts\activate          # Windows
# source ../.venv/bin/activate     # macOS/Linux
uvicorn server:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### Terminal 2 -- Frontend

```bash
cd frontend
npm run dev
```

The dashboard will be available at `http://localhost:5173`. The Vite dev server proxies all `/api` requests to the backend at port 8000.

---

## Usage

### Syncing Emails

Click **Sync Finance Inbox** in the dashboard header. This triggers the full pipeline: Composio fetches invoice emails from Gmail, deduplicates against previously processed messages, analyzes each new email with Claude, and saves the resulting alerts. The dashboard refreshes automatically after sync completes.

### Uploading Statements

Click **Upload PDF** to upload an individual income statement or financial document. The server extracts text with pdfplumber and sends it to Claude for transaction-level fraud analysis.

### Bank Statement Analysis

Bank statements are automatically parsed when the `/api/statements` endpoint is first called. The six monthly PDFs are read, and transactions are displayed in the Bank Statements section of the dashboard. Statement-based fraud analysis runs automatically during email sync, comparing Month 6 transactions against the Month 1-5 baseline.

### Viewing Alert Details

Click **View** on any alert in the Alert Queue to open the Report Analysis page. This shows the full risk breakdown: risk score, risk level, AI summary, contributing factors with severity ratings, flags, and similar cases.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Summary counters (total alerts, high risk, resolved) |
| GET | `/api/alerts` | All alerts |
| GET | `/api/risk-distribution` | LOW/MEDIUM/HIGH alert counts |
| GET | `/api/alerts-over-time` | Alert counts grouped by day of week |
| GET | `/api/top-anomalies` | Most common fraud flags |
| GET | `/api/investigation-case` | Highest-risk alert with similar cases |
| GET | `/api/pattern-insights` | AI-derived pattern observations |
| GET | `/api/top-risk-vendors` | Vendors ranked by alert frequency |
| GET | `/api/report/{alert_id}` | Full detail for a single alert |
| GET | `/api/statements` | Parsed transactions from all 6 bank statement PDFs |
| POST | `/api/sync-email` | Fetch, analyze, and save new invoice emails |
| POST | `/api/upload-statement` | Upload and analyze a PDF financial document |
| POST | `/api/analyze-statements` | Run baseline-comparison analysis on bank statements |

---

## Running the CLI Agent

The standalone agent provides interactive conversational access to Gmail, Google Sheets, and Google Drive:

```bash
cd Backend
python agent.py
```

This launches a terminal-based chat interface powered by Claude through Composio's MCP server. Type queries to search emails, retrieve documents, or investigate specific transactions. Type `exit` to quit.

Note: The CLI agent requires `claude-agent-sdk` which is separate from the web application's dependencies.

---

## License

This project was built at TartanHacks 2026 at Carnegie Mellon University.
