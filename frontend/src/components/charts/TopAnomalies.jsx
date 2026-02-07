import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TopAnomalies = ({ data }) => {
  if (!data) return null

  const colors = ['#ef4444', '#f59e0b', '#f97316', '#10b981']

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/60">
        <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Top Anomalies</h3>
        <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
          No anomalies yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Top Anomalies</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="type"
            type="category"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
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
            <span className="text-slate-400">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopAnomalies

