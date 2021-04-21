import React, { useState, FC, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransactionCategory, updateStatusAction } from 'actions/actionCreator';
import {
  ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
  CREDIT_TYPE,
  INVALID_CATEGORY_WARNING,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING,
  url
} from 'Constants';
import { AddCategoryProps } from './interface';
import Loader from 'components/Loader';

import styles from './styles.module.scss';
import { ReduxStore } from 'reducers/interface';

const addTransactionCategoryToDB = async (userId: string, category: string, type: string) => {
  let typeUrl = url.API_URL_ADD_DEBIT_TRANSACTION_CATEGORY;
  if (type === CREDIT_TYPE) {
    typeUrl = url.API_URL_ADD_CREDIT_TRANSACTION_CATEGORY;
  }
  return await fetch(typeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "userId": userId,
      "category": category,
    })
  });

}

const AddCategory: FC<AddCategoryProps> = ({
  title,
  type,
}): ReactElement => {
  const userId = useSelector((state: ReduxStore) => state.user.userId);
  const dispatch = useDispatch();
  const [newCategory, setNewCategory] = useState('');
  const [loader, setLoader] = useState(false);

  const handleAddCategory = () => {
    if (newCategory === '') {
      dispatch(updateStatusAction({
        showFeedBack: true,
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
            showFeedBack: true,
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