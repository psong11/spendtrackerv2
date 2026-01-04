export interface BudgetCategory {
  id: string
  name: string
  budget: number
}

// Monthly budgets (defaults). These are used as a fallback when localStorage
// has not been initialized yet.
export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: "grocery", name: "Grocery", budget: 400 },
  { id: "rent", name: "Rent", budget: 1600 },
  { id: "car", name: "Car", budget: 330 },
  { id: "gas", name: "Gas", budget: 70 },
  { id: "eating-out", name: "Eating Out", budget: 320 },
  { id: "personal-development", name: "Personal Development", budget: 200 },
  { id: "essential-subscriptions", name: "Essential Subscriptions", budget: 50 },
  { id: "medical-health", name: "Medical/Health", budget: 20 },
  { id: "investments-assets", name: "Investments/Assets", budget: 2889 },
]

// The overall budget target shown on the dashboard.
export const TOTAL_MONTHLY_BUDGET = 5879
