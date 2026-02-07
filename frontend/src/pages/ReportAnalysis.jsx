import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const ReportAnalysis = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.getReportAnalysis(id).then((res) => {
      if (!cancelled) {
        setData(res)
        setLoading(false)
        if (!res) setError('Report not found')
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err?.message || 'Failed to load report')
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [id])

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'MEDIUM': return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
      default: return 'text-green-400 bg-green-500/20 border-green-500/50'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-amber-400'
      default: return 'text-slate-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-slate-200 text-lg font-semibold">Loading report</p>
            <p className="text-slate-400 text-sm mt-1 font-medium">Analyzing risk factors...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-600/50 border-l-4 border-l-blue-500 max-w-md mx-4">
          <p className="text-slate-200 text-lg font-semibold mb-4">{error || 'Report not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-300 hover:text-blue-200 font-semibold py-2.5 px-5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const { alert, riskScore, riskLevel, summary, factors, flags, similarCases } = data

  return (
    <div className="min-h-screen">
      <header className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/60 border-t-0 border-b-blue-500/40 px-6 py-4 shadow-lg animate-fade-in-up transition-all duration-300 rounded-b-2xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-slate-100 flex items-center gap-2 text-sm font-semibold rounded-xl py-2 px-3 -ml-1 hover:bg-slate-700 transition-all duration-200"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Report Analysis</h1>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-4 animate-fade-in-up animate-delay-75">
          <span className="text-slate-400 font-medium">Alert #{alert.id}</span>
          <span className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${getRiskColor(riskLevel)}`}>
            Risk {riskScore} — {riskLevel}
          </span>
          <span className="text-slate-300">{alert.type} · {alert.vendor}</span>
          {alert.amount != null && (
            <span className="text-slate-100 font-medium">${alert.amount.toLocaleString()}</span>
          )}
        </div>

        <section className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-up animate-delay-150 transition-all duration-300 hover:border-slate-500/60">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight mb-3">Why is risk high?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">{summary}</p>
          {flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {flags.map((flag, i) => (
                <span key={i} className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-sm border border-amber-500/40">
                  {flag}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-up animate-delay-200 transition-all duration-300 hover:border-slate-500/60">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Risk factors</h2>
          <ul className="space-y-4">
            {factors.map((f) => (
              <li key={f.id} className="border-b border-slate-600 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium capitalize ${getSeverityColor(f.severity)}`}>
                    {f.severity}
                  </span>
                  <span className="text-slate-100 font-medium">{f.title}</span>
                </div>
                <p className="text-slate-400 text-sm pl-0">{f.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {similarCases.length > 0 && (
          <section className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg mb-6 animate-fade-in-up animate-delay-300 transition-all duration-300 hover:border-slate-500/60">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight mb-3">Similar cases</h2>
            <ul className="text-slate-300 text-sm space-y-1">
              {similarCases.map((c, i) => (
                <li key={i}>Case #{c.caseId} — {c.status}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap gap-3 animate-fade-in-up animate-delay-400">
          <button className="bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-[0.98] text-emerald-300 font-semibold py-2.5 px-5 rounded-xl border border-emerald-500/40 transition-all duration-200">
            Approve
          </button>
          <button className="bg-blue-500/20 hover:bg-blue-500/30 active:scale-[0.98] text-blue-300 font-semibold py-2.5 px-5 rounded-xl border border-blue-500/40 transition-all duration-200">
            Escalate
          </button>
          <button className="bg-rose-500/20 hover:bg-rose-500/30 active:scale-[0.98] text-rose-300 font-semibold py-2.5 px-5 rounded-xl border border-rose-500/40 transition-all duration-200">
            Confirm Fraud
          </button>
        </div>
      </main>
    </div>
  )
}

export default ReportAnalysis
