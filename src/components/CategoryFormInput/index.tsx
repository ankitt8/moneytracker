import React, { ReactElement, FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import cn from 'classnames';
import { CategoryFormInputProps } from './interface';


const CategoryFormInput: FC<CategoryFormInputProps> = ({
  categories,
  categorySelected,
  handleCategoryChange,
}): ReactElement => {
  // @ts-ignore


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