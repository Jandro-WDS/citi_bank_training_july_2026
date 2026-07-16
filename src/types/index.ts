export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  userId: string;
  accountType: "SAVINGS" | "CHECKING";
  balance: number;
  interestRate: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "DEPOSIT" | "WITHDRAW";
  amount: number;
  timestamp: string;
}