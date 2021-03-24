import { TransactionInterface } from 'helper';

export interface TransactionCardWrapperProps {
  transactions: TransactionInterface[];
  totalAmount: number;
  title: string;
}
