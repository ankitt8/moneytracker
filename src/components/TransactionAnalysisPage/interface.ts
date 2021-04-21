import { Transaction } from 'interfaces/index.interface';

export interface TransactionAnalysisPage {
  userId: string;
}

export type TransactionsGroupedByCategories = Record<string, {
  transactions: Transaction[];
  totalAmount: number;
}>