import React from 'react'

const TopRiskVendors = ({ vendors }) => {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
        <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Top Risk Vendors</h3>
        <p className="text-slate-400">No vendor data available</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Top Risk Vendors</h3>
      <div className="space-y-3">
        {vendors.map((vendor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-amber-500"></div>
              <span className="text-slate-300 text-sm">{vendor.vendor}</span>
            </div>
            <span className="text-slate-100 font-medium text-sm">
              {vendor.alertCount} Alert{vendor.alertCount !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopRiskVendors

