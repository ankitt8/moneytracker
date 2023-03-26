import { TransactionCategories } from 'components/AddTransactionModal/TransactionCategoryInput/interface';
import { Transaction } from 'interfaces/index.interface';

export interface TransactionsStoreInitialState {
  transactions: Transaction[] | [];
  transactionSummary: TransactionSummary;
  status: Status;
  categories: TransactionCategories;
}

export interface TransactionSummary {
  bank: TransactionSummaryDetails;
  cash: TransactionSummaryDetails;
}

export interface TransactionSummaryDetails {
  credit: number;
  debit: number;
  balance: number;
}

export interface Status {
  showFeedBack: boolean | null;
  msg: string | null;
  severity: string | null;
}

export interface Action {
  type: string;
  payload: Record<string, any> | string | string[];
}
