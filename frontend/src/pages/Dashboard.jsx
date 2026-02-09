import React, { useState, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useDashboardData } from '../hooks/useDashboardData'
import logoGif from '../assets/Cloud robotics abstract.gif'
import TopMetrics from '../components/dashboard/TopMetrics'
import RiskDistribution from '../components/charts/RiskDistribution'
import AlertsOverTime from '../components/charts/AlertsOverTime'
import TopAnomalies from '../components/charts/TopAnomalies'
import AlertQueue from '../components/tables/AlertQueue'
import BankStatements from '../components/tables/BankStatements'
import InvestigationDetails from '../components/panels/InvestigationDetails'
import PatternInsights from '../components/panels/PatternInsights'
import TopRiskVendors from '../components/panels/TopRiskVendors'

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme()
  const {
    summary,
    alerts,
    riskDistribution,
    alertsOverTime,
    topAnomalies,
    investigationCase,
    patternInsights,
    topRiskVendors,
    statements,
    loading,
    syncing,
    uploading,
    syncEmail,
    uploadStatement,
  } = useDashboardData()

  const [notificationCount] = useState(1)
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
      const result = await uploadStatement(file)
      alert(result.message)
      e.target.value = ''
    } catch (err) {
      alert('Upload failed: ' + (err?.message || 'Unknown error'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whitesmoke dark:bg-black/80">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-4 border-neutral-200 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-400 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-neutral-900 dark:text-neutral-100 text-lg font-semibold">Loading dashboard</p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 font-medium">Preparing your insights...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-whitesmoke dark:bg-black/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 border-t-0 border-b-neutral-200 dark:border-b-neutral-700 px-6 py-4 shadow-lg animate-fade-in-up transition-all duration-300 rounded-b-2xl">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-0.5 shadow transition-all duration-300 hover:scale-105">
              <img
                src={logoGif}
                alt="firmMatch logo"
                className="w-10 h-10 rounded-[10px] object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black dark:text-neutral-100 tracking-tight">Fraud Detection Dashboard</h1>
              <p className="text-xs text-black dark:text-neutral-400 font-semibold mt-0.5">firmMatch · Real-time insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-50 text-black dark:text-neutral-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-neutral-300 dark:border-neutral-600"
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
            <button
              onClick={handleSyncEmail}
              disabled={syncing}
              className="bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100 active:scale-[0.98] disabled:opacity-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-neutral-700 dark:border-neutral-200"
            >
              {syncing ? 'Syncing...' : 'Sync Finance Inbox'}
            </button>
            {/* Theme toggle - pill style (thumb right = dark, left = light) */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggleTheme}
              className="relative inline-flex h-8 w-14 flex-shrink-0 rounded-full border border-neutral-300 dark:border-neutral-600 bg-[#98aceb] dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`pointer-events-none absolute top-1 left-1 inline-block h-6 w-6 rounded-full bg-[#e6e6e6] dark:bg-neutral-200 shadow-sm transition-transform duration-200 ease-out ${
                  isDark ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
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

        {/* Bank Statements */}
        <div className="mb-8 animate-fade-in-up animate-delay-100">
          <BankStatements statements={statements} />
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

