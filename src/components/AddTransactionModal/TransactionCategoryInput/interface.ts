export interface TransactionCategoryInputProps {
  categories: string[];
  categorySelected: string;
  handleCategoryChange: (category: string) => void;
}

export interface TransactionCategories {
  credit: string[];
  debit: string[];
}