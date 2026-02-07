import React from 'react'
import { useNavigate } from 'react-router-dom'

const AlertQueue = ({ alerts }) => {
  const navigate = useNavigate()
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
        <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Alert Queue</h3>
        <p className="text-slate-400">No alerts available</p>
      </div>
    )
  }

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
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Alert Queue</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Risk</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Type</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Vendor / Entity</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Reason</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200"
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
                <td className="py-3 px-4 text-slate-300 text-sm">{alert.type}</td>
                <td className="py-3 px-4 text-slate-300 text-sm">{alert.vendor}</td>
                <td className="py-3 px-4 text-slate-300 text-sm">
                  {alert.amount ? `$${alert.amount.toLocaleString()}` : '-'}
                </td>
                <td className="py-3 px-4 text-slate-300 text-sm">{alert.reason}</td>
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
                        ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                        : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
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
    </div>
  )
}

export default AlertQueue

