"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

function AmountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fund = searchParams.get("fund")
  const [amount, setAmount] = useState("")

  const handleContinue = () => {
    if (amount && Number.parseFloat(amount) > 0) {
      router.push(`/category?fund=${fund}&amount=${amount}`)
    }
  }

  const handleNumberClick = (num: string) => {
    if (num === "." && amount.includes(".")) return
    setAmount(amount + num)
  }

  const handleDelete = () => {
    setAmount(amount.slice(0, -1))
  }

  const handleClear = () => {
    setAmount("")
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Enter Amount</h1>
          <p className="text-muted-foreground capitalize">{fund?.replace("-", " ")}</p>
        </div>

        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold text-primary">${amount || "0.00"}</div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "←"].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === "←") handleDelete()
                else handleNumberClick(btn)
              }}
              className="p-6 bg-card hover:bg-accent rounded-xl text-2xl font-semibold transition-colors"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 p-4 bg-card hover:bg-accent rounded-xl font-medium transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleContinue}
            disabled={!amount || Number.parseFloat(amount) === 0}
            className="flex-1 p-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  )
}

export default function AmountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AmountContent />
    </Suspense>
  )
}
