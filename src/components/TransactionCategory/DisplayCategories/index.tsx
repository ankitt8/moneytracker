import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { DEBIT_TYPE } from '../../../Constants';
import { DisplayCategoriesProps } from './interface';
import styles from './styles.module.scss';

const DisplayCategories: FC<DisplayCategoriesProps> = ({
  type,
}): ReactElement => {
  // @ts-ignore
  let transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];
  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  return (
    <div className={styles.categoryInput}>
      {
        categories.map((category) => {
          return (
            <div
              key={category}
              className={styles.category}
            >
              {category}
            </div>
          )
        })
      }
    </div>
  )
}

export default DisplayCategories;