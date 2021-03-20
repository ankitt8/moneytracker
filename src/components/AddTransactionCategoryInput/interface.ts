export interface CategoryFormInputProps {
  categories: string[];
  categorySelected: string;
  handleCategoryChange: (category: string) => void;
}

export interface TransactionCategory {
  credit: string[];
  debit: string[];
}