"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CreditCard, Wallet } from "lucide-react"
import { getFundSources } from "@/lib/storage"
import type { FundSource } from "@/lib/types"

const fundColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
]

interface DisplayFund extends FundSource {
  icon: typeof CreditCard | typeof Wallet
  color: string
}

export default function Home() {
  const router = useRouter()
  const [fundSources, setFundSources] = useState<DisplayFund[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFunds = useCallback(async () => {
    const funds = await getFundSources()
    const mapped: DisplayFund[] = funds.map((fund, index) => ({
      ...fund,
      icon: fund.id === "checking" ? Wallet : CreditCard,
      color: fundColors[index % fundColors.length],
    }))
    setFundSources(mapped)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadFunds()
  }, [loadFunds])

  const handleFundSelect = (fundId: string) => {
    router.push(`/amount?fund=${fundId}`)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-md">
          <p className="text-muted-foreground text-center">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance">Track Your Spending</h1>
          <p className="text-muted-foreground text-pretty">Select your payment source</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {fundSources.map((fund) => {
            const Icon = fund.icon
            return (
              <Card
                key={fund.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleFundSelect(fund.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`${fund.color} p-4 rounded-xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{fund.name}</h3>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full p-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          View Dashboard
        </button>
      </div>
    </main>
  )
}
