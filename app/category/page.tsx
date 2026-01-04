"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getCategories } from "@/lib/storage"
import { getCategoryMeta } from "@/lib/categoryMeta"
import type { BudgetCategory } from "@/lib/budgetDefaults"
import type { LucideIcon } from "lucide-react"

interface CategoryDisplay {
  id: string
  name: string
  color: string
  icon: LucideIcon
}

function CategoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fund = searchParams.get("fund")
  const amount = searchParams.get("amount")
  const [categories, setCategories] = useState<CategoryDisplay[]>([])

  useEffect(() => {
    const savedCategories: BudgetCategory[] = getCategories()
    const mapped: CategoryDisplay[] = savedCategories.map((cat) => {
      const meta = getCategoryMeta(cat.id)
      return {
        id: cat.id,
        name: cat.name,
        color: meta.color,
        icon: meta.icon,
      }
    })
    setCategories(mapped)
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/confirmation?fund=${fund}&amount=${amount}&category=${categoryId}`)
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Select Category</h1>
          <p className="text-xl text-primary font-semibold">${amount}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`${category.color} p-4 rounded-xl`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-sm text-balance">{category.name}</h3>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent />
    </Suspense>
  )
}
