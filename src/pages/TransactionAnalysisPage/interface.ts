import { Transaction } from 'interfaces/index.interface';

export interface TransactionAnalysisPageProps {
  userId?: string;
  transactionsProps: Transaction[];
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
