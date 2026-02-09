import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTheme } from '../../contexts/ThemeContext'

const RiskDistribution = ({ data }) => {
  const { isDark } = useTheme()
  if (!data) return null

  const total = data.low + data.medium + data.high
  const chartData = [
    { name: 'Low', value: data.low, color: '#10b981' },
    { name: 'Medium', value: data.medium, color: '#f59e0b' },
    { name: 'High', value: data.high, color: '#ef4444' },
  ]
  const tooltipStyle = isDark
    ? { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#ffffff' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#18181b' }
  const tooltipLabelStyle = { color: isDark ? '#ffffff' : '#18181b' }
  const tooltipItemStyle = { color: isDark ? '#ffffff' : '#18181b' }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Risk Distribution</h3>
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-neutral-600 dark:text-neutral-300 text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm">
          No risk data yet
        </div>
      )}
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-500 dark:text-neutral-400">{item.name}</span>
            </div>
            <span className="text-neutral-800 dark:text-neutral-100 font-medium">
              {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskDistribution

