import React, { useState, useRef, useEffect } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { api } from '../services/api'
import logoGif from '../assets/Cloud robotics abstract.gif'
import TopMetrics from '../components/dashboard/TopMetrics'
import RiskDistribution from '../components/charts/RiskDistribution'
import AlertsOverTime from '../components/charts/AlertsOverTime'
import TopAnomalies from '../components/charts/TopAnomalies'
import AlertQueue from '../components/tables/AlertQueue'
import InvestigationDetails from '../components/panels/InvestigationDetails'
import PatternInsights from '../components/panels/PatternInsights'
import TopRiskVendors from '../components/panels/TopRiskVendors'

const Dashboard = () => {
  const {
    summary,
    alerts,
    riskDistribution,
    alertsOverTime,
    topAnomalies,
    investigationCase,
    patternInsights,
    topRiskVendors,
    loading,
    syncing,
    syncEmail,
  } = useDashboardData()

  const [notificationCount] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [demoRunning, setDemoRunning] = useState(false)
  const [demoPayment, setDemoPayment] = useState(null)
  const [demoDecision, setDemoDecision] = useState(null)
  const [riskReasons, setRiskReasons] = useState([])
  const [activityFeed, setActivityFeed] = useState([])
  const [humanAction, setHumanAction] = useState(null)
  const [driveAuthorized, setDriveAuthorized] = useState(false)
  const fileInputRef = useRef(null)

  const handleSyncEmail = async () => {
    try {
      await syncEmail()
      // Optionally show a success message
      alert('Email sync initiated successfully')
    } catch (error) {
      alert('Failed to sync email: ' + (error.message || 'Unknown error'))
    }
  }

  const handleUploadPdf = () => {
    fileInputRef.current?.click()
  }

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file.')
      e.target.value = ''
      return
    }
    if (!driveAuthorized) {
      alert('Google Drive is not connected yet. Click "Connect Drive" first.')
      e.target.value = ''
      return
    }
    try {
      setUploading(true)
      addActivity('Statement upload started')
      const result = await api.uploadPdf(file)
      const analysis = result.analysis

      if (analysis) {
        setDemoDecision({ risk: analysis.risk, status: analysis.status })
        setRiskReasons(analysis.reasons)
        setDemoPayment({
          id: result.driveFileId || file.name,
          vendor: analysis.vendor,
          amount: analysis.amount,
          currency: analysis.currency,
          status: analysis.status,
        })
        setHumanAction(null)
        addActivity('Statement uploaded to Google Drive')
        addActivity('AI risk engine completed analysis')
        if (analysis.status === 'HOLD') {
          addActivity('Payment placed on HOLD for human review')
        }
      }

      alert(result.message)
      e.target.value = ''
    } catch (err) {
      alert('Upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const refreshDriveStatus = async () => {
    const status = await api.getDriveAuthStatus()
    setDriveAuthorized(status.authorized)
  }

  const handleConnectDrive = async () => {
    window.open(api.getDriveAuthUrl(), '_blank')
    setTimeout(() => {
      refreshDriveStatus()
    }, 2000)
  }

  function addActivity(text) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setActivityFeed(prev => [{ time: timestamp, text }, ...prev].slice(0, 6))
  }

  useEffect(() => {
    refreshDriveStatus()
  }, [])

  const startStripeDemo = async () => {
    if (demoRunning) return
    setDemoRunning(true)
    setDemoDecision(null)
    setRiskReasons([])
    setActivityFeed([])
    setHumanAction(null)

    const payment = await api.getStripeTestPayment()
    setDemoPayment(payment)
    addActivity('Stripe test payment received')

    setTimeout(() => addActivity('AI risk engine triggered'), 600)
    setTimeout(() => addActivity('Checking vendor registry'), 1200)
    setTimeout(() => addActivity('Comparing historical payment patterns'), 1800)
    setTimeout(() => addActivity('Evaluating policy thresholds'), 2400)

    setTimeout(() => {
      setDemoDecision({ risk: 'HIGH', status: 'HOLD' })
      setRiskReasons([
        'Vendor not found in approved list',
        'Amount exceeds historical average by 240%',
        'Policy threshold violation detected',
      ])
      setDemoPayment(prev => (prev ? { ...prev, status: 'HOLD' } : prev))
      addActivity('Payment placed on HOLD for human review')
      setDemoRunning(false)
    }, 3000)
  }

  const handleReleasePayment = () => {
    if (!demoPayment || demoPayment.status !== 'HOLD') return
    setDemoPayment({ ...demoPayment, status: 'Approved' })
    setHumanAction('Approved by Analyst')
    addActivity('Analyst approved payment')
  }

  const handleEscalatePayment = () => {
    if (!demoPayment || demoPayment.status !== 'HOLD') return
    setDemoPayment({ ...demoPayment, status: 'Escalated' })
    setHumanAction('Escalated to Investigation')
    addActivity('Escalated to investigation queue')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-slate-200 text-lg font-semibold">Loading dashboard</p>
            <p className="text-slate-400 text-sm mt-1 font-medium">Preparing your insights...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/60 border-t-0 border-b-blue-500/40 px-6 py-4 shadow-lg animate-fade-in-up transition-all duration-300 rounded-b-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl border-2 border-blue-400/60 bg-slate-700/80 p-0.5 shadow-lg ring-2 ring-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:ring-blue-500/40">
              <img
                src={logoGif}
                alt="firmMatch logo"
                className="w-10 h-10 rounded-[10px] object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">Fraud Detection Dashboard</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">firmMatch · Real-time insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={onFileSelected}
            />
            <button
              onClick={handleUploadPdf}
              disabled={uploading}
              className="bg-slate-700 hover:bg-slate-600 active:scale-[0.98] disabled:opacity-50 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-600"
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
            <button
              onClick={handleConnectDrive}
              className="bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-600"
            >
              {driveAuthorized ? 'Drive Connected' : 'Connect Drive'}
            </button>
            <button
              onClick={handleSyncEmail}
              disabled={syncing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-accent transition-all duration-200"
            >
              {syncing ? 'Syncing...' : 'Sync Finance Inbox'}
            </button>
            <button className="relative p-2.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-700 transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="relative p-2.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-700 transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-800">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Stripe Demo Workflow */}
        <div className="bg-slate-800/70 border border-slate-600/60 rounded-2xl p-5 mb-8 shadow-lg animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Stripe Payment Hold Demo</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulated Stripe test payment with AI risk hold workflow
                  </p>
                </div>
                <button
                  onClick={startStripeDemo}
                  disabled={demoRunning}
                  className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                >
                  {demoRunning ? 'Running Demo...' : 'Run Demo'}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-700/70 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Stripe Transaction</p>
                  <p className="text-slate-100 font-semibold mt-1">
                    {demoPayment?.vendor || '—'}
                  </p>
                  <div className="mt-2 text-sm text-slate-300">
                    <p>ID: {demoPayment?.id || '—'}</p>
                    <p>
                      Amount: {demoPayment ? `$${demoPayment.amount.toLocaleString()} ${demoPayment.currency}` : '—'}
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        demoPayment?.status === 'HOLD'
                          ? 'bg-rose-500/20 text-rose-300'
                          : demoPayment?.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : demoPayment?.status === 'Escalated'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {demoPayment?.status || '—'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-700/70 rounded-xl p-4">
                  <p className="text-xs text-slate-400">AI Decision</p>
                  <p className="text-slate-100 font-semibold mt-1">
                    {demoDecision ? `${demoDecision.risk} RISK DETECTED` : 'Awaiting analysis'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">Reasoning</p>
                  <ul className="text-xs text-slate-300 mt-2 space-y-1">
                    {riskReasons.length === 0 && <li>—</li>}
                    {riskReasons.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                  {humanAction && (
                    <p className="text-xs text-emerald-300 mt-3 font-semibold">{humanAction}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleReleasePayment}
                  disabled={demoPayment?.status !== 'HOLD'}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                >
                  Release Payment
                </button>
                <button
                  onClick={handleEscalatePayment}
                  disabled={demoPayment?.status !== 'HOLD'}
                  className="bg-amber-600 hover:bg-amber-500 active:scale-[0.98] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                >
                  Escalate Investigation
                </button>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-slate-900/60 border border-slate-700/70 rounded-xl p-4">
              <p className="text-xs text-slate-400">Live Activity Feed</p>
              <div className="mt-3 space-y-2 text-xs text-slate-300">
                {activityFeed.length === 0 && <p>—</p>}
                {activityFeed.map((entry, index) => (
                  <div key={`${entry.time}-${index}`} className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[48px]">{entry.time}</span>
                    <span>{entry.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="animate-fade-in-up animate-delay-75">
          <TopMetrics summary={summary} />
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up animate-delay-150">
          <div className="lg:col-span-1">
            <RiskDistribution data={riskDistribution} />
          </div>
          <div className="lg:col-span-1">
            <AlertsOverTime data={alertsOverTime} />
          </div>
          <div className="lg:col-span-1">
            <TopAnomalies data={topAnomalies} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up animate-delay-300">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <AlertQueue alerts={alerts} />
            <TopRiskVendors vendors={topRiskVendors} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <InvestigationDetails caseData={investigationCase} />
            <PatternInsights insights={patternInsights} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

