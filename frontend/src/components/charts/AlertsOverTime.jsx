import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../contexts/ThemeContext'

const AlertsOverTime = ({ data }) => {
  const { isDark } = useTheme()
  if (!data || data.length === 0) return null

  const gridStroke = isDark ? '#475569' : '#e2e8f0'
  const axisStroke = isDark ? '#94a3b8' : '#64748b'
  const tooltipStyle = isDark
    ? { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }
    : { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#18181b' }

  return (
    <div className="bg-whitesmoke dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-l-neutral-500 dark:border-l-neutral-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-5">Alerts Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis
            dataKey="date"
            stroke={axisStroke}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={axisStroke}
            style={{ fontSize: '12px' }}
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="count"
            stroke={isDark ? '#2563eb' : '#475569'}
            strokeWidth={2}
            dot={{ fill: isDark ? '#2563eb' : '#475569', r: 4 }}
            activeDot={{ r: 6, fill: isDark ? '#3b82f6' : '#64748b' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AlertsOverTime

