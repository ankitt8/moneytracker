export interface Transaction {
  _id: string;
  heading: string;
  amount: number;
  date: Date;
  mode: string;
  type?: string;
  category?: string;
}

export interface CategoryAmountArray {
  category: string;
  totalAmount: number;
}
