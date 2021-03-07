import React, { FC, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DEBIT_TYPE, DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG, SEVERITY_SUCCESS } from '../../../Constants';
import { DisplayCategoriesProps } from './interface';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { deleteTransactionCategory, updateStatusAction } from '../../../actions/actionCreator';
const DisplayCategories: FC<DisplayCategoriesProps> = ({
  type,
}): ReactElement => {
  const dispatch = useDispatch();
  // @ts-ignore
  let transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];
  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const handleDeleteCategory = (category: string): void => {
    dispatch(deleteTransactionCategory(category, type));
    dispatch(updateStatusAction({
      showFeedback: true,
      msg: DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
      severity: SEVERITY_SUCCESS
    }))
  }
  return (
    <div className={styles.categoryInput}>
      {
        categories.map((category) => {
          return (
            <div
              key={category}
              className={styles.categoryWrapper}
            >
              <div>{category}</div>
              <div>|</div>
              <FontAwesomeIcon icon={faWindowClose} onClick={() => handleDeleteCategory(category)} />
            </div>
          )
        })
      }
    </div>
  )
}

export default DisplayCategories;