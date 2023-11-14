import { DisplayCategoriesProps } from './interface';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
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
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0 }}
            key={category}
            className={styles.categoryWrapper}
          >
            <div>{category}</div>
            <button onClick={() => handleDeleteCategory(category)}>
              <Cross />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DisplayCategories;
