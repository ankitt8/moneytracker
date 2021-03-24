import React, { ReactElement, FC } from 'react';
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
const TransactionCategoryInput: FC<TransactionCategoryInputProps> = ({
  categories,
  categorySelected,
  handleCategoryChange,
}): ReactElement => {
  return (
    <div className={styles.TransactionCategoryInput}>
      <div className={styles.flexWrapper}>
        <p className={styles.TransactionCategoryInputLabel}>Category</p>
        <Link to={ROUTES.TRANSACTION_CATEGORIES}> Add Category </Link>
      </div>
      <div className={styles.categoryInput}>
        {categories.length !== 0 ? categories.map((category) => (
          <div
            key={category}
            className={cn(styles.category, {
              [styles.categorySelected]: category === categorySelected
            })}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </div>
        )) : <p className={styles.noData}>!!No Categoires Found!!</p>}
      </div>
    </div>
  )
}

export default TransactionCategoryInput;