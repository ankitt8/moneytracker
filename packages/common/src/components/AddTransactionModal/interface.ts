export interface AddTransactionModalProps {
  userId: string;
  handleClose: (e?: any) => void;
}

export interface AddTransaction {
  userId: string;
  heading: string;
  amount: number;
  date: Date;
  mode: string;
  bankAccount: string;
  creditCard: string;
  type: string;
  category: string;
}
