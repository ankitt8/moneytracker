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
  type: string;
  category: string;
}
