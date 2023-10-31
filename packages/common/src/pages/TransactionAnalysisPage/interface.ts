import { Transaction } from 'interfaces/index.interface';

export interface TransactionAnalysisPageProps {
  userId?: string;
  transactionsProps: Transaction[];
  groupByDate?: boolean;
  groupByPaymentType?: boolean;
  groupByCategory?: boolean;
  startDateParam?: string;
  endDateParam?: string;
  showTransactionsInAscendingOrder?: boolean;
  isNoTransactionsDateVisible?: boolean;
}

export type TransactionsGroupedByCategories = Record<
  string,
  {
    transactions: Transaction[];
    totalAmount: number;
  }
>;

export interface CategoryAmount {
  category: string;
  totalAmount: number;
}
