import React, { useState, ReactElement, FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import cn from 'classnames';
import { CategoryFormInputProps } from './interface';
import { DEBIT_TYPE } from '../../Constants';


const CategoryFormInput: FC<CategoryFormInputProps> = ({
  handleSelectedCategory,
  type
}): ReactElement => {
  // @ts-ignore
  let transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];
  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const [categorySelected, setCategorySelected] = useState('');

  const handleCategoryChange = (category: string) => {
    handleSelectedCategory(category, type);
    setCategorySelected(category);
  }

  return (
    <div className={styles.categoryFormInput}>
      <p className={styles.categoryFormInputLabel}>Category</p>
      {
        categories.length === 0 ? (
          <div>
            No Categories Found!
            Please add categories here
            <Link to='/transaction-category'> Add Category </Link>
          </div>
        ) :
          <div className={styles.categoryInput}>
            {categories.map((category) => (
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
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default CategoryFormInput;