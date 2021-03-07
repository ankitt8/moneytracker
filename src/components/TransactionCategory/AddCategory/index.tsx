import React, { useState, FC, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransactionCategory, updateStatusAction } from 'actions/actionCreator';
import { addTransactionCategoryToDB } from 'helper';
import {
  ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
  INVALID_CATEGORY_WARNING,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING
} from 'Constants';
import { AddCategoryProps } from './interface';
import Loader from 'components/Loader';

import styles from './styles.module.scss';
const AddCategory: FC<AddCategoryProps> = ({
  title,
  type,
}): ReactElement => {
  // @ts-ignore
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  // @ts-ignore
  const [newCategory, setNewCategory] = useState('');
  const [loader, setLoader] = useState(false);

  const handleAddCategory = () => {
    if (newCategory === '') {
      dispatch(updateStatusAction({
        showFeedback: true,
        msg: INVALID_CATEGORY_WARNING,
        severity: SEVERITY_WARNING
      }))
      return;
    }

    setLoader(true);
    addTransactionCategoryToDB(userId, newCategory, type)
      .then((res: any) => {
        if (res.ok) {
          dispatch(addTransactionCategory(newCategory, type));
          dispatch(updateStatusAction({
            showFeedback: true,
            msg: ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
            severity: SEVERITY_SUCCESS
          }))
        }
      })
      .finally(() => {
        setNewCategory('');
        setLoader(false);
      })

  };

  const handleCategoryChange = (e: any) => {
    setNewCategory(e.target.value);
  };

  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.addCategory}>
        <input className={styles.addCategoryInput} type="text" value={newCategory} onChange={handleCategoryChange} />
        {loader ? <Loader /> : <div className={styles.addCategoryIcon} onClick={handleAddCategory}>+</div>}
      </div>

    </>
  );
}

export default AddCategory;