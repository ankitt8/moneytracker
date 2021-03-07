import React, { useState, FC, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { addTransactionCategory, updateStatusAction } from '../../../actions/actionCreator';
import { ADD_TRANSACTION_CATEGORY_SUCCESS_MSG, INVALID_CATEGORY_WARNING, SEVERITY_SUCCESS, SEVERITY_WARNING } from '../../../Constants';
import { AddCategoryProps } from './interface';
import styles from './styles.module.scss';
const AddCategory: FC<AddCategoryProps> = ({
  title,
  type
}): ReactElement => {
  const dispatch = useDispatch();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory === '') {
      dispatch(updateStatusAction({
        showFeedback: true,
        msg: INVALID_CATEGORY_WARNING,
        severity: SEVERITY_WARNING
      }))
      return;
    }

    setNewCategory('');
    dispatch(addTransactionCategory(newCategory, type));
    dispatch(updateStatusAction({
      showFeedback: true,
      msg: ADD_TRANSACTION_CATEGORY_SUCCESS_MSG,
      severity: SEVERITY_SUCCESS
    }))
  };

  const handleCategoryChange = (e: any) => {
    setNewCategory(e.target.value);
  };

  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.addCategory}>
        <input className={styles.addCategoryInput} type="text" value={newCategory} onChange={handleCategoryChange} />
        <div className={styles.addCategoryIcon} onClick={handleAddCategory}>+</div>
      </div>
    </>
  )
}

export default AddCategory;