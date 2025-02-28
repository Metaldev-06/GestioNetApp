export interface ModifyBalanceResponse {
  id: string;
  balance: number;
  debt: number;
  debtLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModifyBalanceBody {
  amount: number;
  accountId: string;
  description?: string | null;
}
