"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Settings, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { TOTAL_MONTHLY_BUDGET, type BudgetCategory } from "@/lib/budgetDefaults"
import { getCategoryMeta } from "@/lib/categoryMeta"
import {
  getCategories,
  listTransactionsPastMonth,
  deleteTransaction,
  getFundName,
} from "@/lib/storage"
import type { Transaction } from "@/lib/types"

interface CategoryData {
  category: string
  name: string
  spent: number
  budget: number
  transactions: Transaction[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const loadDashboardData = useCallback(async () => {
    const transactions = await listTransactionsPastMonth()
    const categories = getCategories()

    // Group transactions by category
    const grouped = categories.map((category: BudgetCategory) => {
      const categoryTransactions = transactions
        .filter((t) => t.category === category.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        category: category.id,
        name: category.name,
        spent,
        budget: category.budget,
        transactions: categoryTransactions,
      }
    })

    setCategoryData(grouped)
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId)
    loadDashboardData()
  }

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0)
  const totalBudget = TOTAL_MONTHLY_BUDGET
  const totalPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <main className="min-h-screen bg-background p-6 pb-24">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track your spending</p>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="p-3 bg-card hover:bg-accent rounded-xl transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        <Card className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total Budget</h2>
            <span className="text-sm text-muted-foreground">
              ${totalSpent.toFixed(2)} / ${totalBudget}
            </span>
          </div>
          <Progress value={totalPercent} className="h-3" />
          <p className="text-sm text-muted-foreground text-center">
            {totalPercent.toFixed(0)}% of total budget used
          </p>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          {categoryData.map((data) => {
            const percentSpent = data.budget > 0 ? Math.min((data.spent / data.budget) * 100, 100) : 0
            const isExpanded = expandedCategories.has(data.category)
            const { color: categoryColor, icon: Icon } = getCategoryMeta(data.category)

            return (
              <Card key={data.category} className="overflow-hidden">
                <button
                  onClick={() => toggleExpand(data.category)}
                  className="w-full p-6 space-y-3 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`${categoryColor} p-2 rounded-lg shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold truncate">{data.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        ${data.spent.toFixed(2)} / ${data.budget}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${categoryColor} transition-all duration-300`}
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{percentSpent.toFixed(0)}% used</p>
                </button>

                {isExpanded && data.transactions.length > 0 && (
                  <div className="border-t bg-muted/30">
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Transaction History</h4>
                      {data.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">${transaction.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{getFundName(transaction.fund)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(transaction.date), "MMM d, yyyy")}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTransaction(transaction.id)
                              }}
                              className="p-2 rounded-md hover:bg-accent transition-colors"
                              aria-label="Delete transaction"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isExpanded && data.transactions.length === 0 && (
                  <div className="border-t bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground text-center">No transactions yet</p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full p-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Add Transaction
        </button>
      </div>
    </main>
  )
}
