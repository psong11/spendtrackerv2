"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CreditCard, Wallet } from "lucide-react"

const defaultFundSources = [
  { id: "checking", name: "Checking Account", icon: Wallet, color: "bg-emerald-500" },
  { id: "chase", name: "Chase Credit Card", icon: CreditCard, color: "bg-blue-500" },
  { id: "bofa", name: "BofA Credit Card", icon: CreditCard, color: "bg-red-500" },
  { id: "discover", name: "Discover Credit Card", icon: CreditCard, color: "bg-orange-500" },
]

export default function Home() {
  const router = useRouter()
  const [fundSources, setFundSources] = useState(defaultFundSources)

  useEffect(() => {
    const saved = localStorage.getItem("fundSources")
    if (saved) {
      const customFunds = JSON.parse(saved)
      const mapped = customFunds.map((fund: any, index: number) => ({
        ...fund,
        icon: CreditCard,
        color: defaultFundSources[index % defaultFundSources.length]?.color || "bg-blue-500",
      }))
      setFundSources(mapped)
    }
  }, [])

  const handleFundSelect = (fundId: string) => {
    router.push(`/amount?fund=${fundId}`)
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
