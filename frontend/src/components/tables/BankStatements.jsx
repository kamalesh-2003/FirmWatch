import React, { useState } from 'react'

const MONTHS = [
  { num: 1, label: 'Jan' },
  { num: 2, label: 'Feb' },
  { num: 3, label: 'Mar' },
  { num: 4, label: 'Apr' },
  { num: 5, label: 'May' },
  { num: 6, label: 'Jun' },
]

const BankStatements = ({ statements }) => {
  const [activeMonth, setActiveMonth] = useState(6)

  const current = statements?.[activeMonth]
  const transactions = current?.transactions || []

  const formatAmount = (val) => {
    if (val == null) return ''
    const abs = Math.abs(val)
    const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return val < 0 ? `-$${formatted}` : `$${formatted}`
  }

  const getBalanceColor = (balance) => {
    if (balance < 0) return 'text-red-500'
    return 'text-neutral-800 dark:text-neutral-200'
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
        Bank Statements
      </h3>

      {/* Month Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {MONTHS.map(({ num, label }) => {
          const monthData = statements?.[num]
          const closing = monthData?.closingBalance
          const isActive = activeMonth === num
          const isNegative = closing != null && closing < 0

          return (
            <button
              key={num}
              onClick={() => setActiveMonth(num)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-neutral-800 dark:bg-white text-white dark:text-neutral-900 border-neutral-700 dark:border-neutral-200 shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <span>{label}</span>
              {closing != null && (
                <span className={`text-[10px] mt-0.5 font-medium ${
                  isActive
                    ? isNegative ? 'text-red-300 dark:text-red-500' : 'text-neutral-300 dark:text-neutral-500'
                    : isNegative ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {formatAmount(closing)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Period Summary */}
      {current && (
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {current.period}
          </span>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-neutral-500 dark:text-neutral-400">
              Open: <span className="text-neutral-700 dark:text-neutral-300">{formatAmount(current.openingBalance)}</span>
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              Close: <span className={getBalanceColor(current.closingBalance)}>{formatAmount(current.closingBalance)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      {transactions.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">No transactions for this month.</p>
      ) : (
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-whitesmoke dark:bg-neutral-900/95">
              <tr className="border-b border-neutral-200 dark:border-neutral-600">
                <th className="text-left py-3 px-3 text-neutral-500 dark:text-neutral-400 text-xs font-medium w-20">Date</th>
                <th className="text-left py-3 px-3 text-neutral-500 dark:text-neutral-400 text-xs font-medium">Transaction</th>
                <th className="text-right py-3 px-3 text-neutral-500 dark:text-neutral-400 text-xs font-medium w-24">Debit</th>
                <th className="text-right py-3 px-3 text-neutral-500 dark:text-neutral-400 text-xs font-medium w-24">Credit</th>
                <th className="text-right py-3 px-3 text-neutral-500 dark:text-neutral-400 text-xs font-medium w-28">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-neutral-100 dark:border-neutral-700/50 transition-colors duration-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 ${
                    idx % 2 === 0 ? '' : 'bg-neutral-50/50 dark:bg-neutral-800/20'
                  }`}
                >
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 text-xs font-medium whitespace-nowrap">
                    {txn.date}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300 text-xs">
                    {txn.description}
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs font-medium text-red-500">
                    {txn.debit != null ? formatAmount(txn.debit) : ''}
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs font-medium text-green-600 dark:text-green-400">
                    {txn.credit != null ? formatAmount(txn.credit) : ''}
                  </td>
                  <td className={`py-2.5 px-3 text-right text-xs font-semibold ${getBalanceColor(txn.balance)}`}>
                    {formatAmount(txn.balance)}
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

export default BankStatements
