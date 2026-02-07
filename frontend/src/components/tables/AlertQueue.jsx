import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { key: 'Invoice', label: 'Invoice Alerts' },
  { key: 'Transaction', label: 'Transaction Alerts' },
]

const AlertQueue = ({ alerts }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Invoice')

  const filtered = (alerts || []).filter((a) => a.type === activeTab)

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-500 bg-red-500/10'
    if (score >= 50) return 'text-orange-500 bg-orange-500/10'
    return 'text-green-500 bg-green-500/10'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Escalated':
        return 'text-red-600'
      case 'Under Review':
        return 'text-amber-600'
      case 'New Alert':
        return 'text-blue-600'
      default:
        return 'text-slate-500'
    }
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Alert Queue</h3>
        <div className="flex gap-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg p-1">
          {TABS.map((tab) => {
            const count = (alerts || []).filter((a) => a.type === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50'
                }`}
              >
                {tab.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No {activeTab.toLowerCase()} alerts available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-600">
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Risk</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Vendor / Entity</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Reason</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Status</th>
                <th className="text-left py-3 px-4 text-neutral-500 dark:text-neutral-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(
                        alert.riskScore
                      )}`}
                    >
                      Risk {alert.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 text-sm">{alert.type}</td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 text-sm">{alert.vendor}</td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 text-sm">
                    {alert.amount ? `$${alert.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 text-sm">{alert.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/report/${alert.id}`)}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105 ${
                        alert.status === 'Escalated'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 hover:bg-rose-500/30'
                          : 'bg-blue-500/20 text-blue-600 dark:text-blue-300 hover:bg-blue-500/30'
                      }`}
                    >
                      View &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AlertQueue
