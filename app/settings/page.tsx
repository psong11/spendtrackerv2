"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, DollarSign } from "lucide-react"
import type { BudgetCategory } from "@/lib/budgetDefaults"
import type { FundSource } from "@/lib/types"
import {
  getCategories,
  setCategories as saveCategoriesToStorage,
  getFundSources,
  setFundSources as saveFundsToStorage,
} from "@/lib/storage"

export default function SettingsPage() {
  const router = useRouter()
  const [funds, setFunds] = useState<FundSource[]>([])
  const [categories, setCategories] = useState<BudgetCategory[]>([])
  const [showAddFund, setShowAddFund] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newFundName, setNewFundName] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryBudget, setNewCategoryBudget] = useState("")

  useEffect(() => {
    setFunds(getFundSources())
    setCategories(getCategories())
  }, [])

  const saveFunds = (newFunds: FundSource[]) => {
    setFunds(newFunds)
    saveFundsToStorage(newFunds)
  }

  const saveCategories = (newCategories: BudgetCategory[]) => {
    setCategories(newCategories)
    saveCategoriesToStorage(newCategories)
  }

  const handleAddFund = () => {
    if (!newFundName.trim()) return

    const newFund: FundSource = {
      id: newFundName.toLowerCase().replace(/\s+/g, "-"),
      name: newFundName,
    }

    saveFunds([...funds, newFund])
    setNewFundName("")
    setShowAddFund(false)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !newCategoryBudget) return

    const newCategory: BudgetCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      name: newCategoryName,
      budget: Number.parseFloat(newCategoryBudget),
    }

    saveCategories([...categories, newCategory])
    setNewCategoryName("")
    setNewCategoryBudget("")
    setShowAddCategory(false)
  }

  const handleDeleteFund = (id: string) => {
    saveFunds(funds.filter((f) => f.id !== id))
  }

  const handleDeleteCategory = (id: string) => {
    saveCategories(categories.filter((c) => c.id !== id))
  }

  const handleUpdateBudget = (id: string, newBudget: string) => {
    const budget = Number.parseFloat(newBudget)
    if (isNaN(budget)) return

    const updated = categories.map((c) => (c.id === id ? { ...c, budget } : c))
    saveCategories(updated)
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

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your funds and categories</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fund Sources</h2>
            <button
              onClick={() => setShowAddFund(!showAddFund)}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {showAddFund && (
            <Card className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Fund source name"
                value={newFundName}
                onChange={(e) => setNewFundName(e.target.value)}
                className="w-full p-3 bg-background border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddFund(false)
                    setNewFundName("")
                  }}
                  className="flex-1 p-2 bg-card hover:bg-accent rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFund}
                  className="flex-1 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {funds.map((fund) => (
              <Card key={fund.id} className="p-4 flex justify-between items-center">
                <span className="font-medium">{fund.name}</span>
                <button
                  onClick={() => handleDeleteFund(fund.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories</h2>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {showAddCategory && (
            <Card className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-3 bg-background border rounded-lg"
              />
              <input
                type="number"
                placeholder="Budget amount"
                value={newCategoryBudget}
                onChange={(e) => setNewCategoryBudget(e.target.value)}
                className="w-full p-3 bg-background border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddCategory(false)
                    setNewCategoryName("")
                    setNewCategoryBudget("")
                  }}
                  className="flex-1 p-2 bg-card hover:bg-accent rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{category.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={category.budget}
                    onChange={(e) => handleUpdateBudget(category.id, e.target.value)}
                    className="flex-1 p-2 bg-background border rounded-lg text-sm"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
