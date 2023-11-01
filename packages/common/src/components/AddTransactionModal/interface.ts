import { TRANSACTION_TYPE } from './TransactionCategoryInput/interface';

export interface AddTransactionModalProps {
  userId: string;
  handleClose: (e?: any) => void;
}

export interface AddTransaction {
  userId: string;
  heading: string;
  amount: number;
  date: Date;
  mode: string;
  bankAccount: string;
  creditCard: string;
  type: string;
  category: string;
}

export interface IUpdateLatestTransactionCategoriesLocalStorage {
  category: string;
  type: TRANSACTION_TYPE;
}

export interface ILocalStorageAddTransactionState {
  categories: string[];
  mode: string;
  type: string;
  bankAccount: string;
  creditCard: string;
  date: Date;
}
