export interface DisplayCategoriesProps {
  categories: string[];
  handleDeleteCategory: (category: string) => void;
  isLoaderVisible: boolean;
}
