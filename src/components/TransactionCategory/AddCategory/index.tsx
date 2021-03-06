import React, { useState, FC, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { addTransactionCategory } from '../../../actions/actionCreator';
import { AddCategoryProps } from './interface';
import styles from './styles.module.scss';
const AddCategory: FC<AddCategoryProps> = ({
  title,
  type
}): ReactElement => {
  const dispatch = useDispatch();
  const [newCategory, setNewCategory] = useState('');
  const handleAddCategory = () => {
    dispatch(addTransactionCategory(newCategory, type));
  };
  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    if (category === '') {
      return;
    }
    setNewCategory(category);
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