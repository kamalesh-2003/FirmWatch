import React from 'react'

const TopMetrics = ({ summary }) => {
  if (!summary) return null

  const metrics = [
    {
      label: 'Total Invoices',
      value: summary.totalInvoices.toLocaleString(),
      border: 'border-l-blue-500',
      bar: 'bg-blue-500',
    },
    {
      label: 'High Risk Alerts',
      value: summary.highRiskAlerts,
      border: 'border-l-rose-500',
      bar: 'bg-rose-500',
    },
    {
      label: 'Flagged Amount',
      value: `$${summary.flaggedAmount.toLocaleString()}`,
      border: 'border-l-amber-500',
      bar: 'bg-amber-500',
    },
    {
      label: 'Cases Resolved',
      value: summary.casesResolved,
      border: 'border-l-violet-500',
      bar: 'bg-violet-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 ${metric.border} rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/60`}
        >
          <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {metric.label}
          </div>
          <div className="text-3xl font-bold text-slate-100 tracking-tight mb-4">
            {metric.value}
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${metric.bar} rounded-full transition-all duration-700 ease-out`}
              style={{ width: '60%' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopMetrics

