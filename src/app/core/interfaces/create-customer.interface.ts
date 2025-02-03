export interface CreateCustomerResponse {
  name: string;
  dni: null | string;
  address: null | string;
  city: null | string;
  email: null | string;
  phone: null | string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
}

export interface Account {
  balance: number;
  debt: number;
  customer: CreateCustomerResponse;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerBody {
  name: string;
  email?: string;
  address?: string;
  city?: string;
  dni?: string;
  phone?: string;
}
