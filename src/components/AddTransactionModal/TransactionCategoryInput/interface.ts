export interface TransactionCategoryInputProps {
  categories: string[];
  categorySelected: string;
  handleCategoryChange: (category: TransactionCategory) => void;
}

export interface TransactionCategories {
  credit: string[];
  debit: string[];
  lent: string[];
}

export type TransactionCategory = string;
