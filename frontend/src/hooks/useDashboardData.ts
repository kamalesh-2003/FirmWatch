import { useState, useEffect } from 'react'
import { api, DashboardSummary, Alert, RiskDistribution, AlertTimeSeries, Anomaly, InvestigationCase, PatternInsight, TopRiskVendor } from '../services/api'

export interface DashboardData {
  summary: DashboardSummary | null
  alerts: Alert[]
  riskDistribution: RiskDistribution | null
  alertsOverTime: AlertTimeSeries[]
  topAnomalies: Anomaly[]
  investigationCase: InvestigationCase | null
  patternInsights: PatternInsight[]
  topRiskVendors: TopRiskVendor[]
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
    loading: true,
    error: null,
  })

  const [syncing, setSyncing] = useState(false)

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
      ] = await Promise.all([
        api.getDashboardSummary(),
        api.getAlerts(),
        api.getRiskDistribution(),
        api.getAlertsOverTime(),
        api.getTopAnomalies(),
        api.getInvestigationCase(),
        api.getPatternInsights(),
        api.getTopRiskVendors(),
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
      // Optionally reload data after sync
      // await loadDashboardData()
      return result
    } catch (error) {
      throw error
    } finally {
      setSyncing(false)
    }
  }

  return {
    ...data,
    syncing,
    syncEmail,
    refresh: loadDashboardData,
  }
}

