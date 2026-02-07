// Mock API service layer
// This will be replaced with real fetch() calls when backend is ready

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

// Mock API functions
export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalInvoices: 1248,
      highRiskAlerts: 12,
      flaggedAmount: 48200,
      casesResolved: 9,
    }
  },

  async getAlerts(): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        id: '1',
        riskScore: 92,
        type: 'Invoice',
        vendor: 'Delta Supplies',
        amount: 8420,
        reason: 'Duplicate Invoice',
        status: 'Under Review',
      },
      {
        id: '2',
        riskScore: 78,
        type: 'Invoice',
        vendor: 'Global Tech',
        amount: 5100,
        reason: 'High Amount',
        status: 'New Alert',
      },
      {
        id: '3',
        riskScore: 64,
        type: 'Statement',
        vendor: '-',
        amount: null,
        reason: 'Revenue Anomaly',
        status: 'Under Review',
      },
      {
        id: '4',
        riskScore: 55,
        type: 'Invoice',
        vendor: 'Pinnacle Inc.',
        amount: 12300,
        reason: 'Edited Document',
        status: 'Escalated',
      },
      {
        id: '5',
        riskScore: 88,
        type: 'Invoice',
        vendor: 'Acme Corp',
        amount: 15200,
        reason: 'Duplicate Invoice',
        status: 'New Alert',
      },
    ]
  },

  async getRiskDistribution(): Promise<RiskDistribution> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      low: 45,
      medium: 33,
      high: 22,
    }
  },

  async getAlertsOverTime(): Promise<AlertTimeSeries[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 45 },
      { date: 'Wed', count: 28 },
      { date: 'Thu', count: 35 },
      { date: 'Fri', count: 52 },
      { date: 'Sat', count: 18 },
      { date: 'Sun', count: 8 },
      { date: 'Mon', count: 68 },
    ]
  },

  async getTopAnomalies(): Promise<Anomaly[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { type: 'Duplicate Invoices', count: 45 },
      { type: 'Amount Spike', count: 32 },
      { type: 'Vendor Change', count: 28 },
      { type: 'Late Night Submission', count: 15 },
    ]
  },

  async getInvestigationCase(caseId?: string): Promise<InvestigationCase | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!caseId) {
      return {
        caseId: '4821',
        riskScore: 84,
        riskLevel: 'HIGH',
        vendor: 'Delta Supplies',
        amount: 8420,
        flags: [
          'Bank Account Change',
          'Invoice 3x Normal Amount',
          'Edited in Photoshop',
          'Submitted Sunday 2.14 AM',
        ],
        similarCases: [
          { caseId: '3745', status: 'Confirmed Fraud' },
          { caseId: '3621', status: 'Escalated' },
        ],
      }
    }
    
    // In real implementation, fetch by caseId
    return null
  },

  async getPatternInsights(): Promise<PatternInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { id: '1', text: 'Duplicate Invoices Up 28%' },
      { id: '2', text: 'Weekend Submissions Detected' },
    ]
  },

  async getTopRiskVendors(): Promise<TopRiskVendor[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      { vendor: 'Acme Corp', alertCount: 4 },
      { vendor: 'Delta Supplies', alertCount: 3 },
      { vendor: 'Global Tech', alertCount: 2 },
      { vendor: 'Pinnacle Inc.', alertCount: 2 },
    ]
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

    const factorMap: Record<string, { factors: RiskFactor[]; flags: string[]; summary: string }> = {
      '1': {
        summary: 'This invoice was flagged due to multiple high-severity indicators: duplicate submission, recent bank account change, and metadata suggesting editing. The submission time (Sunday 2:14 AM) is outside normal business hours.',
        flags: ['Bank Account Change', 'Invoice 3x Normal Amount', 'Edited in Photoshop', 'Submitted Sunday 2:14 AM'],
        factors: [
          { id: '1', title: 'Duplicate invoice detected', severity: 'high', description: 'An invoice with the same vendor, amount, and reference was already processed in the last 90 days. Duplicates are a common fraud pattern.' },
          { id: '2', title: 'Vendor bank details changed', severity: 'high', description: 'Payment details for this vendor were updated shortly before this invoice. Fraudsters often change bank accounts to redirect funds.' },
          { id: '3', title: 'Document metadata indicates editing', severity: 'high', description: 'PDF metadata shows creation in Photoshop. Legitimate invoices are typically generated from accounting systems, not image editors.' },
          { id: '4', title: 'Unusual submission time', severity: 'medium', description: 'Submitted at 2:14 AM on a Sunday. High-value invoices are rarely submitted outside business hours.' },
          { id: '5', title: 'Amount above typical range', severity: 'medium', description: 'This amount is approximately 3x the average invoice from this vendor in the past 12 months.' },
        ],
      },
      '2': {
        summary: 'This invoice shows a significant amount spike compared to historical vendor activity. Combined with a new contact email domain, it warrants manual review before approval.',
        flags: ['Amount Spike', 'New Contact Domain'],
        factors: [
          { id: '1', title: 'Amount spike vs. history', severity: 'high', description: 'Invoice amount is 2.5x the 12-month average for this vendor. Sudden spikes can indicate inflated or fake invoices.' },
          { id: '2', title: 'New contact domain', severity: 'medium', description: 'Vendor contact email domain changed from @globaltech.com to @globaltech-invoices.com. Verify the new domain is legitimate.' },
          { id: '3', title: 'Round-number amount', severity: 'low', description: 'Amount is a round number ($5,100). While not conclusive, round numbers are slightly more common in fabricated documents.' },
        ],
      },
      '3': {
        summary: 'Statement-level anomaly detected in revenue patterns. The system flagged a deviation from expected seasonal and vendor mix. Review supporting documents and reconciliation.',
        flags: ['Revenue Anomaly', 'Vendor Mix Shift'],
        factors: [
          { id: '1', title: 'Revenue anomaly', severity: 'high', description: 'Reported revenue for this period deviates more than 2 standard deviations from the expected model (seasonality and history).' },
          { id: '2', title: 'Vendor mix shift', severity: 'medium', description: 'Share of spend with top 5 vendors changed significantly vs. prior period. May indicate new or fake vendors.' },
        ],
      },
      '4': {
        summary: 'This invoice was edited after creation—metadata and content analysis suggest the amount or payee may have been altered. Already escalated; ensure compliance review before payment.',
        flags: ['Edited Document', 'Amount Altered', 'Payee Mismatch'],
        factors: [
          { id: '1', title: 'Edited document', severity: 'high', description: 'PDF history and content hashes indicate the document was modified after initial creation. Key fields (amount, date, or payee) may have been changed.' },
          { id: '2', title: 'Payee mismatch', severity: 'high', description: 'Payee name or ID in the document does not fully match the vendor master record. Could indicate invoice hijacking or impersonation.' },
          { id: '3', title: 'Amount altered', severity: 'high', description: 'Numeric amount appears to have been overwritten or re-rendered; font and alignment differ from the rest of the invoice.' },
        ],
      },
      '5': {
        summary: 'Duplicate invoice from a high-risk vendor. Same reference and amount as a recently paid invoice. Immediate review recommended before any payment run.',
        flags: ['Duplicate Invoice', 'High-Risk Vendor', 'Same Reference'],
        factors: [
          { id: '1', title: 'Duplicate invoice', severity: 'high', description: 'An invoice with the same vendor reference and amount was paid in the last 30 days. Paying again would be a duplicate payment.' },
          { id: '2', title: 'High-risk vendor', severity: 'medium', description: 'This vendor has multiple past alerts (including one confirmed fraud). All invoices from this vendor are scored higher.' },
          { id: '3', title: 'Same bank account', severity: 'low', description: 'Payment would go to the same account as the previous payment. No account change, but duplicate payment risk remains.' },
        ],
      },
    }

    const template = factorMap[alertId] ?? {
      summary: 'This item was flagged by automated rules. Review the factors below and supporting documents before approving or escalating.',
      flags: [alert.reason],
      factors: [
        { id: '1', title: alert.reason, severity: 'high' as const, description: 'This alert was raised based on configured rules. Review document and vendor history.' },
      ],
    }

    return {
      alert,
      riskScore: alert.riskScore,
      riskLevel,
      summary: template.summary,
      factors: template.factors,
      flags: template.flags,
      similarCases: alertId === '1' ? [{ caseId: '3745', status: 'Confirmed Fraud' }, { caseId: '3621', status: 'Escalated' }] : [],
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

