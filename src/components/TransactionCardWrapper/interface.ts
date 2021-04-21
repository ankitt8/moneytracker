import { Transaction } from 'interfaces/index.interface';

export interface TransactionCardWrapperProps {
  transactions: Transaction[];
  totalAmount: number;
  title: string;
}
