export interface CategoryFormInputProps {
  categories: string[];
  categorySelected: string;
  handleCategoryChange: (category: string) => void;
}