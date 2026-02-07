import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const RiskDistribution = ({ data }) => {
  if (!data) return null

  const chartData = [
    { name: 'Low', value: data.low, color: '#10b981' },
    { name: 'Medium', value: data.medium, color: '#f59e0b' },
    { name: 'High', value: data.high, color: '#ef4444' },
  ]

  const COLORS = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#ef4444',
  }

  return (
    <div className="bg-slate-800/85 backdrop-blur-xl border border-slate-600/50 border-l-4 border-l-blue-500 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500/60">
      <h3 className="text-lg font-bold text-slate-100 tracking-tight mb-5">Risk Distribution</h3>
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
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-slate-300 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-400">{item.name}</span>
            </div>
            <span className="text-slate-100 font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskDistribution

