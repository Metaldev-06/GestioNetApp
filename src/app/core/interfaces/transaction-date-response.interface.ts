export interface TransactionDateResponse {
  transactions: Transaction[];
  total: number;
}

export interface Transaction {
  year: number;
  month: number;
  transactionsTotal: number;
}
