import { DEFAULT_BUDGET_CATEGORIES, type BudgetCategory } from "./budgetDefaults"
import type { Transaction, FundSource } from "./types"

const KEYS = {
  categories: "categories",
  fundSources: "fundSources",
} as const

// ─────────────────────────────────────────────────────────────
// Generic helpers (for categories/fundSources only - still localStorage)
// ─────────────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed as T
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// ─────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────

export function getCategories(): BudgetCategory[] {
  const saved = readJSON<BudgetCategory[]>(KEYS.categories, [])
  return saved.length > 0 ? saved : DEFAULT_BUDGET_CATEGORIES
}

export function setCategories(categories: BudgetCategory[]): void {
  writeJSON(KEYS.categories, categories)
}

export function getCategoryBudget(categoryId: string): number {
  const categories = getCategories()
  const found = categories.find((c) => c.id === categoryId)
  return found?.budget ?? 0
}

// ─────────────────────────────────────────────────────────────
// Fund Sources
// ─────────────────────────────────────────────────────────────

export const DEFAULT_FUND_SOURCES: FundSource[] = [
  { id: "checking", name: "Checking Account" },
  { id: "chase", name: "Chase Credit Card" },
  { id: "bofa", name: "BofA Credit Card" },
  { id: "discover", name: "Discover Credit Card" },
]

export function getFundSources(): FundSource[] {
  const saved = readJSON<FundSource[]>(KEYS.fundSources, [])
  return saved.length > 0 ? saved : DEFAULT_FUND_SOURCES
}

export function setFundSources(funds: FundSource[]): void {
  writeJSON(KEYS.fundSources, funds)
}

export function getFundName(fundId: string): string {
  const funds = getFundSources()
  const found = funds.find((f) => f.id === fundId)
  return found?.name ?? fundId
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
