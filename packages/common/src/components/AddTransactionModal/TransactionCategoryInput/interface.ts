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
  renderedByComponentName?: string;
}

export type TransactionCategories = Record<TRANSACTION_TYPE, string[]>;

export type TransactionCategory = string;
