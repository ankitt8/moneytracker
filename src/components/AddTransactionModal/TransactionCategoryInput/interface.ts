export interface TransactionCategoryInputProps {
  categories: string[];
  categorySelected: string;
  handleCategoryChange: (category: TransactionCategory) => void;
}

export interface TransactionCategories {
  credit: string[];
  debit: string[];
  borrowed: string[];
}

export type TransactionCategory = string;
