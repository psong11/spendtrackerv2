"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { getCategoryMeta, formatCategoryName } from "@/lib/categoryMeta"
import { addTransaction, getCategoryBudget, getCategorySpending } from "@/lib/storage"

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fund = searchParams.get("fund")
  const amount = searchParams.get("amount")
  const category = searchParams.get("category")
  const [spending, setSpending] = useState(0)
  const [budget, setBudget] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const hasSaved = useRef(false)

  useEffect(() => {
    if (!fund || !amount || !category) {
      router.push("/")
      return
    }

    // Prevent duplicate saves in React Strict Mode
    if (hasSaved.current) {
      return
    }
    hasSaved.current = true

    // Save transaction using storage helper
    addTransaction({
      fund,
      amount: Number.parseFloat(amount),
      category,
    })

    // Get budget and spending for this category
    setBudget(getCategoryBudget(category))
    setSpending(getCategorySpending(category))
    setIsAnimating(true)
  }, [fund, amount, category, router])

  const percentSpent = budget > 0 ? Math.min((spending / budget) * 100, 100) : 0
  const categoryName = category ? formatCategoryName(category) : ""
  const { color: categoryColor } = category ? getCategoryMeta(category) : { color: "bg-primary" }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-8">
        <div
          className={`text-center space-y-6 transition-all duration-500 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <div className="flex justify-center">
            <div className="bg-green-500 p-6 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">You're killing it bud</h1>
            <p className="text-lg text-muted-foreground">
              ${amount} added to {categoryName}
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{categoryName}</h3>
              <span className="text-sm text-muted-foreground">
                ${spending.toFixed(2)} / ${budget}
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full ${categoryColor} transition-all duration-500`}
                style={{ width: `${percentSpent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">{percentSpent.toFixed(0)}% of budget used</p>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-full p-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Add Another Transaction
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full p-4 bg-card hover:bg-accent rounded-xl font-medium transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
