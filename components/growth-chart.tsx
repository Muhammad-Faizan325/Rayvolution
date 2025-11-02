"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const data = [
  { month: "Jan", adoption: 1200, efficiency: 65 },
  { month: "Feb", adoption: 1450, efficiency: 68 },
  { month: "Mar", adoption: 1680, efficiency: 71 },
  { month: "Apr", adoption: 1920, efficiency: 74 },
  { month: "May", adoption: 2200, efficiency: 76 },
  { month: "Jun", adoption: 2520, efficiency: 78 },
  { month: "Jul", adoption: 2847, efficiency: 80 },
]

export function GrowthChart() {
  return (
    <div className="glass-dark p-6 rounded-xl neon-border-cyan">
      <h3 className="text-foreground/70 text-sm font-medium mb-6">Solar Growth Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(147, 197, 253, 0.8)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgba(147, 197, 253, 0)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 197, 253, 0.1)" />
          <XAxis dataKey="month" stroke="rgba(147, 197, 253, 0.5)" />
          <YAxis stroke="rgba(147, 197, 253, 0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(147, 197, 253, 0.3)",
              borderRadius: "8px",
            }}
            cursor={{ stroke: "rgba(147, 197, 253, 0.3)" }}
          />
          <Line
            type="monotone"
            dataKey="adoption"
            stroke="rgba(147, 197, 253, 1)"
            dot={{ fill: "rgba(147, 197, 253, 1)", r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={3}
            isAnimationActive={true}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-4">
        <div>
          <p className="text-xs text-foreground/60">Current Users</p>
          <p className="text-xl font-bold text-primary">2,847</p>
        </div>
        <div>
          <p className="text-xs text-foreground/60">Growth This Month</p>
          <p className="text-xl font-bold text-accent">+327</p>
        </div>
      </div>
    </div>
  )
}
