import { TransactionInterface } from 'helper';

export interface DayTransactionsCardProps {
  transactions: TransactionInterface[];
  totalAmount: number;
  title: string;
}
