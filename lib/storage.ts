import { DEFAULT_BUDGET_CATEGORIES, type BudgetCategory } from "./budgetDefaults"
import type { Transaction, FundSource } from "./types"

const KEYS = {
  transactions: "transactions",
  categories: "categories",
  fundSources: "fundSources",
} as const

// ─────────────────────────────────────────────────────────────
// Generic helpers
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
// Transactions
// ─────────────────────────────────────────────────────────────

export function listTransactions(): Transaction[] {
  return readJSON<Transaction[]>(KEYS.transactions, [])
}

export function listTransactionsPastMonth(): Transaction[] {
  const all = listTransactions()
  const now = new Date()
  const monthAgo = new Date(now)
  monthAgo.setMonth(monthAgo.getMonth() - 1)

  return all
    .filter((t) => {
      const d = new Date(t.date)
      return d >= monthAgo && d <= now
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function addTransaction(tx: Omit<Transaction, "id" | "date">): Transaction {
  const newTx: Transaction = {
    ...tx,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }
  const all = listTransactions()
  all.push(newTx)
  writeJSON(KEYS.transactions, all)
  return newTx
}

export function deleteTransaction(id: string): void {
  const all = listTransactions()
  const updated = all.filter((t) => t.id !== id)
  writeJSON(KEYS.transactions, updated)
}

export function getCategorySpending(categoryId: string): number {
  const transactions = listTransactionsPastMonth()
  return transactions
    .filter((t) => t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0)
}
