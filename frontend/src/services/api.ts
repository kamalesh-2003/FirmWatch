// API service layer — replace with real fetch() calls when backend is ready.
// Placeholder responses use 0 / empty so the UI shows stats once backend is connected.

export interface DashboardSummary {
  totalInvoices: number
  highRiskAlerts: number
  flaggedAmount: number
  casesResolved: number
}

export interface Alert {
  id: string
  riskScore: number
  type: 'Invoice' | 'Transaction'
  vendor: string
  amount: number | null
  reason: string
  status: 'New Alert' | 'Under Review' | 'Escalated' | 'Resolved'
}

export interface RiskDistribution {
  low: number
  medium: number
  high: number
}

export interface AlertTimeSeries {
  date: string
  count: number
}

export interface Anomaly {
  type: string
  count: number
}

export interface InvestigationCase {
  caseId: string
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  vendor: string
  amount: number
  flags: string[]
  similarCases: Array<{
    caseId: string
    status: string
  }>
}

export interface PatternInsight {
  id: string
  text: string
}

export interface TopRiskVendor {
  vendor: string
  alertCount: number
}

export interface StatementTransaction {
  date: string
  description: string
  debit: number | null
  credit: number | null
  balance: number
}

export interface StatementMonth {
  month: number
  label: string
  period: string
  openingBalance: number
  closingBalance: number
  transactions: StatementTransaction[]
}

export interface RiskFactor {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low'
  description: string
}

export interface ReportAnalysis {
  alert: Alert
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  summary: string
  factors: RiskFactor[]
  flags: string[]
  similarCases: Array<{ caseId: string; status: string }>
}

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch('/api/dashboard/summary')
    if (!res.ok) throw new Error('Failed to fetch dashboard summary')
    return res.json()
  },

  async getAlerts(): Promise<Alert[]> {
    const res = await fetch('/api/alerts')
    if (!res.ok) throw new Error('Failed to fetch alerts')
    return res.json()
  },

  async getRiskDistribution(): Promise<RiskDistribution> {
    const res = await fetch('/api/risk-distribution')
    if (!res.ok) throw new Error('Failed to fetch risk distribution')
    return res.json()
  },

  async getAlertsOverTime(): Promise<AlertTimeSeries[]> {
    const res = await fetch('/api/alerts-over-time')
    if (!res.ok) throw new Error('Failed to fetch alerts over time')
    return res.json()
  },

  async getTopAnomalies(): Promise<Anomaly[]> {
    const res = await fetch('/api/top-anomalies')
    if (!res.ok) throw new Error('Failed to fetch top anomalies')
    return res.json()
  },

  async getInvestigationCase(_caseId?: string): Promise<InvestigationCase | null> {
    const res = await fetch('/api/investigation-case')
    if (!res.ok) throw new Error('Failed to fetch investigation case')
    return res.json()
  },

  async getPatternInsights(): Promise<PatternInsight[]> {
    const res = await fetch('/api/pattern-insights')
    if (!res.ok) throw new Error('Failed to fetch pattern insights')
    return res.json()
  },

  async getTopRiskVendors(): Promise<TopRiskVendor[]> {
    const res = await fetch('/api/top-risk-vendors')
    if (!res.ok) throw new Error('Failed to fetch top risk vendors')
    return res.json()
  },

  async syncEmail(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/sync-email', { method: 'POST' })
    if (!res.ok) throw new Error('Email sync failed')
    return res.json()
  },

  async getReportAnalysis(alertId: string): Promise<ReportAnalysis | null> {
    const res = await fetch(`/api/report/${alertId}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch report analysis')
    return res.json()
  },

  async uploadStatement(file: File): Promise<{ success: boolean; message: string; processed?: number }> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload-statement', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  },

  async getStatements(): Promise<Record<number, StatementMonth>> {
    const res = await fetch('/api/statements')
    if (!res.ok) throw new Error('Failed to fetch statements')
    return res.json()
  },

  async analyzeStatements(): Promise<{ success: boolean; message: string; processed?: number }> {
    const res = await fetch('/api/analyze-statements', { method: 'POST' })
    if (!res.ok) throw new Error('Statement analysis failed')
    return res.json()
  },
}

