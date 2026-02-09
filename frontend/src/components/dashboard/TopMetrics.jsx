import React from 'react'

const TopMetrics = ({ summary }) => {
  if (!summary) return null

  const metrics = [
    {
      label: 'Total Invoices',
      value: summary.totalInvoices.toLocaleString(),
      border: 'border-l-neutral-400 dark:border-l-neutral-500',
      bar: 'bg-neutral-500 dark:bg-neutral-400',
    },
    {
      label: 'High Risk Alerts',
      value: summary.highRiskAlerts,
      border: 'border-l-neutral-400 dark:border-l-neutral-500',
      bar: 'bg-neutral-600 dark:bg-neutral-500',
    },
    {
      label: 'Cases Resolved',
      value: summary.casesResolved,
      border: 'border-l-neutral-400 dark:border-l-neutral-500',
      bar: 'bg-neutral-400 dark:bg-neutral-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 ${metric.border} rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600`}
        >
          <div className="text-black dark:text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {metric.label}
          </div>
          <div className="text-3xl font-bold text-black dark:text-neutral-100 tracking-tight mb-4">
            {metric.value}
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
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

