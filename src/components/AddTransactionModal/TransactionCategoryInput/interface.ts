import { BORROWED_TYPE, CREDIT_TYPE, DEBIT_TYPE } from '../../../Constants';

export enum TRANSACTION_TYPE {
  credit = 'credit',
  debit = 'debit',
  borrowed = 'borrowed'
}
export interface TransactionCategoryInputProps {
  type?: TRANSACTION_TYPE;
  categories?: string[];
  categorySelected: string;
  handleCategoryChange: (category: TransactionCategory) => void;
}

export interface TransactionCategories {
  credit: string[];
  debit: string[];
  borrowed: string[];
}

export type TransactionCategory = string;
