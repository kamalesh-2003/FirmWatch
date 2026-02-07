import React, { useState, useRef } from 'react'
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
    try {
      setUploading(true)
      const result = await api.uploadPdf(file)
      alert(result.message)
      e.target.value = ''
    } catch (err) {
      alert('Upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
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

