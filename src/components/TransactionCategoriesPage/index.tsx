import React, { ReactElement } from 'react';
import { CREDIT_TYPE, DEBIT_TYPE } from 'Constants';
import AddCategory from './AddCategory';
import DisplayCategories from './DisplayCategories';
import styles from './styles.module.scss';

const TransactionCategoriesPage = (): ReactElement => {
  return (
    <div className={styles.transactionCategoriesPage}>
      <div className={styles.transactionCategoryCard}>
        <AddCategory
          title='Credit Transaction Category'
          type={CREDIT_TYPE}
        />
        <DisplayCategories type={CREDIT_TYPE} />
      </div>

      <div className={styles.transactionCategoryCard}>
        <AddCategory
          title='Debit Transaction Category'
          type={DEBIT_TYPE}
        />
        <DisplayCategories type={DEBIT_TYPE} />
      </div>
    </div>
  )
}

export default TransactionCategoriesPage;