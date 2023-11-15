import { DisplayCategoriesProps } from './interface';
import styles from './styles.module.scss';
import { NO_CATEGORIES_FOUND } from '../../Constants';
import { Cross } from '../Icons/Cross';

const DisplayCategories = ({
  categories,
  handleDeleteCategory
}: DisplayCategoriesProps) => {
  if (!categories || categories.length === 0) {
    return <p className={styles.noData}>!!{NO_CATEGORIES_FOUND}!!</p>;
  }
  return (
    <div className={styles.categoriesWrapper}>
      {categories.map((category) => {
        return (
          <div key={category} className={styles.categoryWrapper}>
            <div>{category}</div>
            <button onClick={() => handleDeleteCategory(category)}>
              <Cross />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayCategories;
