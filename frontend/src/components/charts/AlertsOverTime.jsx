import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AlertsOverTime = ({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Alerts Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AlertsOverTime

