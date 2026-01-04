import {
  ShoppingCart,
  Home,
  Car,
  Fuel,
  UtensilsCrossed,
  BookOpen,
  Wifi,
  Heart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

export interface CategoryMeta {
  color: string
  icon: LucideIcon
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  grocery: { color: "bg-green-500", icon: ShoppingCart },
  rent: { color: "bg-purple-500", icon: Home },
  car: { color: "bg-blue-500", icon: Car },
  gas: { color: "bg-orange-500", icon: Fuel },
  "eating-out": { color: "bg-red-500", icon: UtensilsCrossed },
  "personal-development": { color: "bg-indigo-500", icon: BookOpen },
  "essential-subscriptions": { color: "bg-cyan-500", icon: Wifi },
  "medical-health": { color: "bg-pink-500", icon: Heart },
  "investments-assets": { color: "bg-emerald-500", icon: TrendingUp },
}

const DEFAULT_META: CategoryMeta = { color: "bg-primary", icon: ShoppingCart }

export function getCategoryMeta(categoryId: string): CategoryMeta {
  return CATEGORY_META[categoryId] || DEFAULT_META
}

export function formatCategoryName(categoryId: string): string {
  return categoryId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
