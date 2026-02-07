import React from 'react'

const TopRiskVendors = ({ vendors }) => {
  if (!vendors || vendors.length === 0) {
    return (
      <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Top Risk Vendors</h3>
        <p className="text-neutral-500 dark:text-neutral-400">No vendor data available</p>
      </div>
    )
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Top Risk Vendors</h3>
      <div className="space-y-3">
        {vendors.map((vendor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded bg-amber-500"></div>
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">{vendor.vendor}</span>
            </div>
            <span className="text-neutral-800 dark:text-neutral-100 font-medium text-sm">
              {vendor.alertCount} Alert{vendor.alertCount !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopRiskVendors

