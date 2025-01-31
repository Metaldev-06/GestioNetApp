export interface RegisterResponse {
  token: string;
  customer: Customer;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
