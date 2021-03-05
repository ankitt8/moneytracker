import React, { useState, ReactElement, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { addTransactionCategory } from '../../actions/actionCreator';
import cn from 'classnames';
import { CategoryFormInputProps } from './interface';


const CategoryFormInput: FC<CategoryFormInputProps> = (
  { handleSelectedCategory }
): ReactElement => {

  const dispatch = useDispatch();
  // @ts-ignore
  const categories: string[] = useSelector((state) => state.transactions.categories)
  const [categorySelected, setCategorySelected] = useState('');
  const handleAddCategory = (category: string) => {
    dispatch(addTransactionCategory(category));
  }
  const handleCategoryChange = (category: string) => {
    handleSelectedCategory(category);
    setCategorySelected(category);
  }


  return (
    <div className={styles.categoryFormInput}>
      <p className={styles.categoryFormInputLabel}>Category</p>
      {/* <AddOutlinedIcon fontSize="large" onClick={handleAddCategory}/> */}
      <div className={styles.categoryInput}>
        {
          categories.map((category) => {
            return (
              <div
                key={category}
                className={
                  cn(
                    styles.category,
                    {
                      [styles.categorySelected]: category === categorySelected
                    }
                  )
                }
                onClick={() => handleCategoryChange(category)}>{category}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default CategoryFormInput;