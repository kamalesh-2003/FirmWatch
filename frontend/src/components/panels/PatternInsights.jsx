import React from 'react'

const PatternInsights = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Pattern Insights</h3>
        <p className="text-neutral-500 dark:text-neutral-400">No insights available</p>
      </div>
    )
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Pattern Insights</h3>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded bg-amber-500 flex-shrink-0"></div>
            <span className="text-neutral-600 dark:text-neutral-300 text-sm">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatternInsights

