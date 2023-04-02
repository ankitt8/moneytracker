import { Transaction } from 'interfaces';

export interface TransactionsProps {
  transactions: Transaction[];
  fetching?: string;
  showTransactionsInAscendingOrder?: boolean;
  startDateParam?: string;
  endDateParam?: string;
}
