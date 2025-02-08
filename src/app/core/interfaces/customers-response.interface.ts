export interface CustomerResponse {
  data: Customer[];
  pagination: Pagination;
}

export interface Customer {
  id: string;
  name: string;
  dni: null | string;
  address: null | string;
  city: null | string;
  email: null | string;
  phone: null | string;
  createdAt: Date;
  updatedAt: Date;
  account: Account;
}

export interface Account {
  id: string;
  balance: number;
  debt: number;
  createdAt: Date;
  updatedAt: Date;
  debtLimit: number;
}

export interface Pagination {
  total: number;
  pages: number;
  current: number;
  limit: number;
  offset: number;
}
