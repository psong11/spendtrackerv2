"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { BudgetCategory } from "@/lib/budgetDefaults"

// Map Tailwind color classes to hex values for the chart
const COLOR_MAP: Record<string, string> = {
  "bg-green-500": "#22c55e",
  "bg-purple-500": "#a855f7",
  "bg-blue-500": "#3b82f6",
  "bg-orange-500": "#f97316",
  "bg-red-500": "#ef4444",
  "bg-indigo-500": "#6366f1",
  "bg-cyan-500": "#06b6d4",
  "bg-pink-500": "#ec4899",
  "bg-emerald-500": "#10b981",
  "bg-primary": "#8b5cf6", // fallback purple
}

// Extended palette for custom categories
const EXTENDED_COLORS = [
  "#f59e0b", // amber
  "#84cc16", // lime
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
  "#f43f5e", // rose
  "#78716c", // stone
]

interface BudgetPieChartProps {
  categories: BudgetCategory[]
  totalBudget: number
  categoryMeta: Record<string, { color: string }>
}

interface ChartDataItem {
  name: string
  value: number
  color: string
  percentage: string
}

export function BudgetPieChart({ categories, totalBudget, categoryMeta }: BudgetPieChartProps) {
  const allocatedAmount = categories.reduce((sum, c) => sum + c.budget, 0)
  
  // Prepare chart data
  const chartData: ChartDataItem[] = categories.map((category, index) => {
    const meta = categoryMeta[category.id]
    const tailwindClass = meta?.color || "bg-primary"
    let color = COLOR_MAP[tailwindClass]
    
    // If no mapped color, use extended palette
    if (!color) {
      color = EXTENDED_COLORS[index % EXTENDED_COLORS.length]
    }
    
    const percentage = allocatedAmount > 0 
      ? ((category.budget / allocatedAmount) * 100).toFixed(1)
      : "0"
    
    return {
      name: category.name,
      value: category.budget,
      color,
      percentage,
    }
  })

  // Add unallocated portion if applicable
  if (totalBudget > allocatedAmount) {
    const unallocated = totalBudget - allocatedAmount
    chartData.push({
      name: "Unallocated",
      value: unallocated,
      color: "#374151", // gray-700
      percentage: ((unallocated / totalBudget) * 100).toFixed(1),
    })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-muted-foreground text-sm">
            ${data.value.toLocaleString()} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null
    
    return (
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-4 pb-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Add categories to see budget distribution
      </div>
    )
  }

  return (
    <div className="w-full py-2">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="40%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label showing total */}
      <div className="text-center mt-3 pb-1">
        <p className="text-sm text-muted-foreground">
          {allocatedAmount > 0 && (
            <>
              <span className="font-semibold text-foreground">${allocatedAmount.toLocaleString()}</span>
              {" "}of ${totalBudget.toLocaleString()} allocated
            </>
          )}
        </p>
      </div>
    </div>
  )
}
