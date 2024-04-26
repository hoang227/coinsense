declare interface Transaction {
  id: number
  account: string
  created_at: string
  amount: number
  type: string
  description?: string
  tags: Tag[]
}
