import Link from 'next/link';
import styles from './styles.module.scss';
import cn from 'classnames';
import { TransactionCategoryInputProps } from './interface';
import {
  ADD_TRANSACTION_MODAL_COMPONENT_NAME,
  EDIT_TRANSACTION_MODAL_COMPONENT_NAME,
  NO_CATEGORIES_FOUND,
  ROUTES
} from '@moneytracker/common/src/Constants';

/*
  TransactionCategoryInput Component is rendered in AddTransactionModal
  The component provides AddCategory link
  The component shows different transaction categories and allows user to select one of them
*/
const selectAllCategoriesBtnComponentsNotVisible = [
  ADD_TRANSACTION_MODAL_COMPONENT_NAME,
  EDIT_TRANSACTION_MODAL_COMPONENT_NAME
];
const TransactionCategoryInput = ({
  categories,
  categorySelected,
  categoriesSelected,
  handleCategoryChange,
  renderedByComponentName
}: TransactionCategoryInputProps) => {
  const isSelectAllCategoriesBtnVisible =
    selectAllCategoriesBtnComponentsNotVisible.includes(
      renderedByComponentName
    );
  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.transactionCategoryInput}
      >
        <div className={styles.transactionCategoryInputLabel}>Category</div>
        <div>
          {!isSelectAllCategoriesBtnVisible ? (
            <button
              type="button"
              onClick={() => {
                handleCategoryChange(
                  categoriesSelected.length === categories.length
                    ? []
                    : categories
                );
              }}
            >
              Select all categories
            </button>
          ) : null}
          <Link href={ROUTES.TRANSACTION_CATEGORIES}> Add Category </Link>
        </div>
      </div>
      <div className={styles.transactionCategories}>
        {categories?.length !== 0 ? (
          categories?.map((category) => {
            const categoryParsed = category?.category || category;
            return (
              <button
                key={categoryParsed}
                type="button"
                className={cn(styles.transactionCategory, {
                  [styles.transactionCategorySelected]: categorySelected
                    ? categoryParsed === categorySelected
                    : categoriesSelected?.includes(categoryParsed)
                })}
                onClick={() => {
                  handleCategoryChange(categoryParsed);
                }}
              >
                {categoryParsed}
              </button>
            );
          })
        ) : (
          <div className={styles.noData}>!!{NO_CATEGORIES_FOUND}!!</div>
        )}
      </div>
    </>
  );
};

export default TransactionCategoryInput;
