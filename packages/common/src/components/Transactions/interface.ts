import { Transaction } from '@moneytracker/common/src/interfaces';

export interface TransactionsProps {
  transactions: Transaction[];
  fetching?: string;
  showTransactionsInAscendingOrder?: boolean;
  startDateParam?: string;
  endDateParam?: string;
  isNoTransactionsDateVisible?: boolean;
}

export interface IArgs {
  transactions: Transaction[];
  startDateParam?: string;
  endDateParam?: string;
  showTransactionsInAscendingOrder?: boolean;
}

export interface ITransactionsGroupedByDateUIProps {
  transactionsGroupedByDate: Record<string, Transaction[]>;
  isNoTransactionsDateVisible: boolean;
}
