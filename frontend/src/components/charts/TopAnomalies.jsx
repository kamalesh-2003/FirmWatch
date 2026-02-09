import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../contexts/ThemeContext'

const TopAnomalies = ({ data }) => {
  const { isDark } = useTheme()
  if (!data) return null

  const colors = ['#ef4444', '#f59e0b', '#f97316', '#10b981']
  const gridStroke = isDark ? '#475569' : '#e2e8f0'
  const axisStroke = isDark ? '#94a3b8' : '#64748b'
  const tooltipStyle = isDark
    ? { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#ffffff' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#18181b' }
  const tooltipLabelStyle = { color: isDark ? '#ffffff' : '#18181b' }
  const tooltipItemStyle = { color: isDark ? '#ffffff' : '#18181b' }

  if (data.length === 0) {
    return (
      <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Top Anomalies</h3>
        <div className="h-[250px] flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm">
          No anomalies yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Top Anomalies</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis type="number" stroke={axisStroke} style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="type"
            type="category"
            stroke={axisStroke}
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.type} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-neutral-500 dark:text-neutral-400">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopAnomalies

