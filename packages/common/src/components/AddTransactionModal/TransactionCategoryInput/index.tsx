import Link from 'next/link';
import styles from './styles.module.scss';
import cn from 'classnames';
import { TransactionCategoryInputProps } from './interface';
import { ROUTES } from '@moneytracker/common/src/Constants';
import { useSelector } from 'react-redux';
import { ReduxStore } from '../../../reducers/interface';

/*
  TransactionCategoryInput Component is rendered in AddTransactionModal
  The component provides AddCategory link
  The component shows different transaction categories and allows user to select one of them
*/
const TransactionCategoryInput = ({
  type,
  categories: categoriesProps,
  categorySelected,
  handleCategoryChange
}: TransactionCategoryInputProps) => {
  let categories = categoriesProps;
  if (!categories && type) {
    const categoriesStore = useSelector(
      (store: ReduxStore) => store.transactions.categories
    );
    categories = categoriesStore[type];
  }
  return (
    <>
      <div className={styles.transactionCategoryInput}>
        <div className={styles.transactionCategoryInputLabel}>Category</div>
        <Link href={ROUTES.TRANSACTION_CATEGORIES}> Add Category </Link>
      </div>
      <div className={styles.transactionCategories}>
        {categories?.length !== 0 ? (
          categories?.map((category) => {
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
