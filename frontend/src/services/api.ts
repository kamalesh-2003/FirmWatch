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
  type: 'Invoice' | 'Statement'
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
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      totalInvoices: 0,
      highRiskAlerts: 0,
      flaggedAmount: 0,
      casesResolved: 0,
    }
  },

  async getAlerts(): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  },

  async getRiskDistribution(): Promise<RiskDistribution> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { low: 0, medium: 0, high: 0 }
  },

  async getAlertsOverTime(): Promise<AlertTimeSeries[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(date => ({ date, count: 0 }))
  },

  async getTopAnomalies(): Promise<Anomaly[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  },

  async getInvestigationCase(_caseId?: string): Promise<InvestigationCase | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return null
  },

  async getPatternInsights(): Promise<PatternInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  },

  async getTopRiskVendors(): Promise<TopRiskVendor[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return []
  },

  async syncEmail(): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      success: true,
      message: 'Email sync initiated successfully',
    }
  },

  async getReportAnalysis(alertId: string): Promise<ReportAnalysis | null> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const alerts = await this.getAlerts()
    const alert = alerts.find(a => a.id === alertId) ?? null
    if (!alert) return null

    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
      alert.riskScore >= 70 ? 'HIGH' : alert.riskScore >= 50 ? 'MEDIUM' : 'LOW'

    // Placeholder until backend provides analysis by alertId
    return {
      alert,
      riskScore: alert.riskScore,
      riskLevel,
      summary: '',
      factors: [],
      flags: [alert.reason],
      similarCases: [],
    }
  },

  async uploadPdf(file: File): Promise<{ success: boolean; message: string; id?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    return {
      success: true,
      message: `PDF "${file.name}" uploaded successfully. It will be processed and appear in the alert queue.`,
      id: `upload-${Date.now()}`,
    }
  },
}

