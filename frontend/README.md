# firmMatch - Fraud Detection Dashboard

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or the next available port).

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Testing the Dashboard

### What to Expect

1. **Loading State**: You'll see a "Loading dashboard..." message briefly while mock data loads
2. **Dashboard Layout**: 
   - Header with "Sync Finance Inbox" button
   - 4 metric cards at the top
   - 3 charts in a row (Risk Distribution, Alerts Over Time, Top Anomalies)
   - Alert Queue table on the left
   - Investigation Details panel on the right
   - Bottom panels (Top Risk Vendors, Pattern Insights)

### Test Features

1. **Sync Email Button**: 
   - Click "Sync Finance Inbox" in the header
   - Button shows "Syncing..." state
   - After ~1.5 seconds, shows an alert message

2. **Interactive Elements**:
   - Hover over chart elements to see tooltips
   - View alert rows in the table
   - Check risk score color coding (red = high, orange = medium, green = low)

3. **Responsive Design**:
   - Resize browser window to see responsive grid layout
   - Mobile-friendly breakpoints

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # TopMetrics component
│   ├── charts/        # Chart components (Recharts)
│   ├── tables/        # AlertQueue table
│   └── panels/        # Investigation, Insights, Vendors
├── services/
│   └── api.ts         # Mock API layer (ready for backend)
├── hooks/
│   └── useDashboardData.ts  # Data fetching hook
└── pages/
    └── Dashboard.jsx   # Main dashboard page
```

## Backend Integration

When ready to connect to your FastAPI backend:

1. Open `src/services/api.ts`
2. Replace mock functions with real `fetch()` calls
3. Update API endpoints to match your FastAPI routes
4. The component structure already expects the same data shapes

Example:
```typescript
async getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch('/api/dashboard/summary')
  return response.json()
}
```

