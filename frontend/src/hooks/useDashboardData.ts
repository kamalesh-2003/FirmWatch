import { useState, useEffect } from 'react'
import { api, DashboardSummary, Alert, RiskDistribution, AlertTimeSeries, Anomaly, InvestigationCase, PatternInsight, TopRiskVendor, StatementMonth } from '../services/api'

export interface DashboardData {
  summary: DashboardSummary | null
  alerts: Alert[]
  riskDistribution: RiskDistribution | null
  alertsOverTime: AlertTimeSeries[]
  topAnomalies: Anomaly[]
  investigationCase: InvestigationCase | null
  patternInsights: PatternInsight[]
  topRiskVendors: TopRiskVendor[]
  statements: Record<number, StatementMonth>
  loading: boolean
  error: string | null
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    summary: null,
    alerts: [],
    riskDistribution: null,
    alertsOverTime: [],
    topAnomalies: [],
    investigationCase: null,
    patternInsights: [],
    topRiskVendors: [],
    statements: {},
    loading: true,
    error: null,
  })

  const [syncing, setSyncing] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      const [
        summary,
        alerts,
        riskDistribution,
        alertsOverTime,
        topAnomalies,
        investigationCase,
        patternInsights,
        topRiskVendors,
        statements,
      ] = await Promise.all([
        api.getDashboardSummary(),
        api.getAlerts(),
        api.getRiskDistribution(),
        api.getAlertsOverTime(),
        api.getTopAnomalies(),
        api.getInvestigationCase(),
        api.getPatternInsights(),
        api.getTopRiskVendors(),
        api.getStatements(),
      ])

      setData({
        summary,
        alerts,
        riskDistribution,
        alertsOverTime,
        topAnomalies,
        investigationCase,
        patternInsights,
        topRiskVendors,
        statements,
        loading: false,
        error: null,
      })
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
      }))
    }
  }

  const syncEmail = async () => {
    try {
      setSyncing(true)
      const result = await api.syncEmail()
      await loadDashboardData()
      return result
    } catch (error) {
      throw error
    } finally {
      setSyncing(false)
    }
  }

  const uploadStatement = async (file: File) => {
    try {
      setUploading(true)
      const result = await api.uploadStatement(file)
      await loadDashboardData()
      return result
    } finally {
      setUploading(false)
    }
  }

  return {
    ...data,
    syncing,
    uploading,
    syncEmail,
    uploadStatement,
    refresh: loadDashboardData,
  }
}

