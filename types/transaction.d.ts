declare interface Transaction {
  id?: number;
  created_at?: string;
  amount?: number;
  type?: string;
  description?: string;
  tag: string;
}