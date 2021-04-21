export interface AddTransactionModalProps {
    userId: string;
    handleClose: () => void;
}

export interface AddTransaction {
  userId: string;
  heading: string;
  amount: number;
  date: Date;
  mode: string;
  type: string;
  category: string;
}