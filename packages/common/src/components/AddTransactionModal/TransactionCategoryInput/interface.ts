import { BORROWED_TYPE, CREDIT_TYPE, DEBIT_TYPE } from '../../../Constants';

export enum TRANSACTION_TYPE {
  credit = 'credit',
  debit = 'debit',
  borrowed = 'borrowed'
}
export interface TransactionCategoryInputProps {
  categories?: string[];
  categorySelected?: string;
  categoriesSelected?: string[];
  handleCategoryChange: (
    category: TransactionCategory | TransactionCategory[]
  ) => void;
}

export type TransactionCategories = Record<TRANSACTION_TYPE, string[]>;

export type TransactionCategory = string;
