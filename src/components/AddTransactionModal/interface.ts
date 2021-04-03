export interface AddTransactionModalProps {
    userId: object;
    handleClose: () => void;
}

export interface AddTransactionInterface {
  userId: object;
  heading: string;
  amount: number;
  date: Date;
  mode: string;
  type: string;
  category: string;
}