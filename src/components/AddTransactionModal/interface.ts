export interface AddTransactionModalProps {
    modalTitle: string;
    userId: object;
    open: boolean;
    type: string;
    mode: string;
    handleClose: () => void;
}

export interface AddTransactionInterface {
  userId: object
  heading: string
  amount: number
  date: Date
  mode: string
  type: string
}