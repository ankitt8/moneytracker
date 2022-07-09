import { Transaction } from 'interfaces/index.interface';

export interface TransactionsProps {
  transactions: Transaction[];
  fetching: string;
  month: number;
  year?: number;
  showTransactionsInAscendingOrder?: boolean;
}
