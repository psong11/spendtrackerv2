import { DEFAULT_BUDGET_CATEGORIES, TOTAL_MONTHLY_BUDGET, type BudgetCategory } from "./budgetDefaults"
import type { Transaction, FundSource } from "./types"

// ─────────────────────────────────────────────────────────────
// Budget Settings (Supabase via API)
// ─────────────────────────────────────────────────────────────

export interface BudgetSettings {
  total_budget: number
  categories: BudgetCategory[]
  fund_sources: FundSource[]
}

export async function getBudgetSettings(): Promise<BudgetSettings> {
  try {
    const res = await fetch("/api/budget", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch")
    const data = await res.json()
    return {
      total_budget: Number(data.total_budget) || TOTAL_MONTHLY_BUDGET,
      categories: data.categories || DEFAULT_BUDGET_CATEGORIES,
      fund_sources: data.fund_sources || DEFAULT_FUND_SOURCES,
    }
  } catch {
    return {
      total_budget: TOTAL_MONTHLY_BUDGET,
      categories: DEFAULT_BUDGET_CATEGORIES,
      fund_sources: DEFAULT_FUND_SOURCES,
    }
  }
}

export async function updateBudgetSettings(
  settings: Partial<BudgetSettings>
): Promise<BudgetSettings | null> {
  try {
    const res = await fetch("/api/budget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      total_budget: Number(data.total_budget),
      categories: data.categories,
      fund_sources: data.fund_sources,
    }
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// Categories (convenience wrappers)
// ─────────────────────────────────────────────────────────────

export async function getCategories(): Promise<BudgetCategory[]> {
  const settings = await getBudgetSettings()
  return settings.categories
}

export async function setCategories(categories: BudgetCategory[]): Promise<void> {
  await updateBudgetSettings({ categories })
}

export async function getCategoryBudget(categoryId: string): Promise<number> {
  const categories = await getCategories()
  const found = categories.find((c) => c.id === categoryId)
  return found?.budget ?? 0
}

// ─────────────────────────────────────────────────────────────
// Fund Sources (Supabase via API)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_FUND_SOURCES: FundSource[] = [
  { id: "checking", name: "Checking Account" },
  { id: "chase", name: "Chase Credit Card" },
  { id: "bofa", name: "BofA Credit Card" },
  { id: "discover", name: "Discover Credit Card" },
]

export async function getFundSources(): Promise<FundSource[]> {
  const settings = await getBudgetSettings()
  return settings.fund_sources
}

export async function setFundSources(funds: FundSource[]): Promise<void> {
  await updateBudgetSettings({ fund_sources: funds })
}

export async function getFundName(fundId: string): Promise<string> {
  const funds = await getFundSources()
  const found = funds.find((f) => f.id === fundId)
  return found?.name ?? fundId
}

// ─────────────────────────────────────────────────────────────
// Total Budget
// ─────────────────────────────────────────────────────────────

export async function getTotalBudget(): Promise<number> {
  const settings = await getBudgetSettings()
  return settings.total_budget
}

// ─────────────────────────────────────────────────────────────
// Transactions (Supabase via API)
// ─────────────────────────────────────────────────────────────

export async function listTransactionsPastMonth(): Promise<Transaction[]> {
  try {
    const res = await fetch("/api/transactions", { cache: "no-store" })
    if (!res.ok) return []
    const { transactions } = await res.json()
    return transactions ?? []
  } catch {
    return []
  }
}

export async function addTransaction(
  tx: Omit<Transaction, "id" | "date">
): Promise<Transaction | null> {
  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" })
    return res.ok
  } catch {
    return false
  }
}

export async function getCategorySpending(categoryId: string): Promise<number> {
  const transactions = await listTransactionsPastMonth()
  return transactions
    .filter((t) => t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0)
}
