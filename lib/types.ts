export interface Transaction {
  id: string
  fund: string
  amount: number
  category: string
  date: string
}

export interface FundSource {
  id: string
  name: string
}
