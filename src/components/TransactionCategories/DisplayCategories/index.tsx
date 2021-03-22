import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DEBIT_TYPE,
  DELETE_TRANSACTION_CATEGORY_ERROR_MSG,
  DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS
} from 'Constants';
import { DisplayCategoriesProps } from './interface';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { deleteTransactionCategory, getTransactionCategories, updateStatusAction } from 'actions/actionCreator';
import { deleteTransactionCategoryFromDB, getTransactionCategoriesFromDB } from 'helper';
import { TransactionCategory } from 'components/AddTransactionCategoryInput/interface';
import { motion } from 'framer-motion';

const DisplayCategories: FC<DisplayCategoriesProps> = ({
  type,
}): ReactElement => {
  const dispatch = useDispatch();
  // @ts-ignore
  const userId = useSelector((state) => state.user.userId);
  // @ts-ignore
  const transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];
  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const checkTransactionCategoriesChanged = (data: TransactionCategory) => {
    const { credit, debit } = transactionCategories;
    const { credit: dbCredit, debit: dbDebit } = data;
    if (credit.length !== dbCredit.length) return true;
    if (debit.length !== dbDebit.length) return true;
    return false;
  }

  const loadTransactionCategories = useCallback(() => {
    getTransactionCategoriesFromDB(userId)
      .then(({ transactionCategories: dbTransactionCategories }) => {
        if (checkTransactionCategoriesChanged(dbTransactionCategories)) {
          dispatch(getTransactionCategories(dbTransactionCategories));
        }
      });
  }, []);

  useEffect(() => {
    loadTransactionCategories();
  }, []);
  function handleDeleteCategory(category: string) {
    // belwo line is weird I am getting empty array
    // console.log(categories)
    // I spent 3 hours debugging the below issue
    // const updatedCategories = [categories];
    // instead I should have used [...categories]
    const updatedCategories: string[] = [...categories];
    //  if I do console.log({updatedCategories}) then below doesn't work it prints empy array
    // console.log(updatedCategories);
    updatedCategories.splice(categories.findIndex((categoryExisting: string) => categoryExisting === category), 1);

    deleteTransactionCategoryFromDB(userId, updatedCategories, type)
      .then((res: any) => {
        if (res.ok) {
          dispatch(deleteTransactionCategory(category, type));
          dispatch(updateStatusAction({
            showFeedback: true,
            msg: DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
            severity: SEVERITY_SUCCESS
          }));
        } else {
          dispatch(updateStatusAction({
            showFeedback: true,
            msg: DELETE_TRANSACTION_CATEGORY_ERROR_MSG,
            severity: SEVERITY_ERROR
          }));
        }
      });

  }
  return (
    <div className={styles.categoriesWrapper}>
      {
        categories.map((category) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0 }}
              key={category}
              className={styles.categoryWrapper}
            >
              <div>{category}</div>
              <div>|</div>
              <FontAwesomeIcon icon={faWindowClose} onClick={() => handleDeleteCategory(category)} />
            </motion.div>
          )
        })
      }
    </div>
  )
}

export default DisplayCategories;