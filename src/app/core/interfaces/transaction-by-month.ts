export interface TransactionsByMonthResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Date;
}
