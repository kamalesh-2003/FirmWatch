import React from 'react'

const InvestigationDetails = ({ caseData }) => {
  if (!caseData) {
    return (
      <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Investigation Details</h3>
        <p className="text-neutral-500 dark:text-neutral-400">No case selected</p>
      </div>
    )
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'text-red-600'
      case 'MEDIUM':
        return 'text-orange-600'
      default:
        return 'text-green-600'
    }
  }

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-500/20 border-red-500/50'
      case 'MEDIUM':
        return 'bg-orange-500/20 border-orange-500/50'
      default:
        return 'bg-green-500/20 border-green-500/50'
    }
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Case #{caseData.caseId}
        </h3>
        <span
          className={`px-3 py-1 rounded border text-sm font-semibold ${getRiskColor(
            caseData.riskLevel
          )} ${getRiskBgColor(caseData.riskLevel)}`}
        >
          {caseData.riskLevel}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Risk Score</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {caseData.riskScore} - {caseData.riskLevel}
          </div>
        </div>

        <div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Vendor</div>
          <div className="text-neutral-800 dark:text-neutral-100 font-medium">{caseData.vendor}</div>
        </div>

        <div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Amount</div>
          <div className="text-neutral-800 dark:text-neutral-100 font-medium">
            ${caseData.amount.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">Flags</div>
          <ul className="space-y-2">
            {caseData.flags.map((flag, index) => (
              <li key={index} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {flag}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">Similar Cases</div>
          <div className="space-y-2">
            {caseData.similarCases.map((similarCase, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 text-sm"
              >
                <span className="w-2 h-2 rounded bg-blue-500"></span>
                Case #{similarCase.caseId} - {similarCase.status}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-600 space-y-2">
          <button className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-[0.98] text-emerald-700 dark:text-emerald-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border border-emerald-500/40">
            Approve
          </button>
          <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 active:scale-[0.98] text-blue-700 dark:text-blue-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border border-blue-500/40">
            Escalate
          </button>
          <button className="w-full bg-rose-500/20 hover:bg-rose-500/30 active:scale-[0.98] text-rose-700 dark:text-rose-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 border border-rose-500/40">
            Confirm Fraud
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvestigationDetails

