import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import cn from 'classnames';
import { TransactionCategoryInputProps } from './interface';
import { ROUTES } from 'Constants';

/*
  TransactionCategoryInput Component is rendered in AddTransactionModal
  The component provides AddCategory link
  The component shows different transaction categories and allows user to select one of them
*/
const TransactionCategoryInput = ({
  categories,
  categorySelected,
  handleCategoryChange
}: TransactionCategoryInputProps) => {
  return (
    <>
      <div className={styles.transactionCategoryInput}>
        <div className={styles.transactionCategoryInputLabel}>Category</div>
        <Link to={ROUTES.TRANSACTION_CATEGORIES}> Add Category </Link>
      </div>
      <div className={styles.transactionCategories}>
        {categories.length !== 0 ? (
          categories.map((category) => {
            const categoryParsed = category?.category
              ? category?.category
              : category;
            return (
              <p
                key={category}
                className={cn(styles.transactionCategory, {
                  [styles.transactionCategorySelected]:
                    categoryParsed === categorySelected
                })}
                onClick={() => handleCategoryChange(categoryParsed)}
              >
                {categoryParsed}
              </p>
            );
          })
        ) : (
          <div className={styles.noData}>!!No Categoires Found!!</div>
        )}
      </div>
    </>
  );
};

export default TransactionCategoryInput;
