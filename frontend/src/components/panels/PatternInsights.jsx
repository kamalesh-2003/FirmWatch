import React from 'react'

const PatternInsights = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
        <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Pattern Insights</h3>
        <p className="text-slate-400">No insights available</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Pattern Insights</h3>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded bg-amber-500 flex-shrink-0"></div>
            <span className="text-slate-300 text-sm">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatternInsights

