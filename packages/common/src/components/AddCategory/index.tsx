import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTransactionCategory,
  updateStatusAction
} from '@moneytracker/common/src/actions/actionCreator';
import {
  ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
  INVALID_CATEGORY_WARNING,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING
} from '@moneytracker/common/src/Constants';
import { AddCategoryProps } from './interface';
import Loader from '@moneytracker/common/src/components/Loader';

import styles from './styles.module.scss';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import { addTransactionCategoryToDB } from '@moneytracker/common/src/api-services/api.service';

const AddCategory = ({ title, type }: AddCategoryProps) => {
  const dispatch = useDispatch();
  const userId = useSelector((store: ReduxStore) => store.user.userId);
  const [newCategory, setNewCategory] = useState('');
  const [loader, setLoader] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  useEffect(() => {
    setIsComponentMounted(true);
    return () => setIsComponentMounted(false);
  });
  const handleAddCategory = () => {
    if (newCategory === '') {
      dispatch(
        updateStatusAction({
          showFeedBack: true,
          msg: INVALID_CATEGORY_WARNING,
          severity: SEVERITY_WARNING
        })
      );
      return;
    }
    setLoader(true);
    addTransactionCategoryToDB(userId, newCategory, type)
      .then((res: any) => {
        if (res.ok) {
          dispatch(addTransactionCategory(newCategory, type));
          dispatch(
            updateStatusAction({
              showFeedBack: true,
              msg: ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
              severity: SEVERITY_SUCCESS
            })
          );
        }
      })
      .finally(() => {
        if (isComponentMounted) {
          setNewCategory('');
          setLoader(false);
        }
      });
  };

  const handleCategoryChange = (e: any) => {
    setNewCategory(e.target.value);
  };

  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.addCategory}>
        <input
          className={styles.addCategoryInput}
          type="text"
          value={newCategory}
          onChange={handleCategoryChange}
        />
        {loader ? (
          <Loader />
        ) : (
          <div className={styles.addCategoryIcon} onClick={handleAddCategory}>
            +
          </div>
        )}
      </div>
    </>
  );
};

export default AddCategory;
