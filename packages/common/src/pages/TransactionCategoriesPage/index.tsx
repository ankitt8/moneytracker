import {
  CREDIT_TYPE,
  DEBIT_TYPE,
  DELETE_TRANSACTION_CATEGORY_ERROR_MSG,
  DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  BORROWED_TYPE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS
} from '@moneytracker/common/src/Constants';
import AddCategory from '@moneytracker/common/src/components/AddCategory';
import DisplayCategories from '@moneytracker/common/src/components/DisplayCategories';
import styles from './styles.module.scss';
import {
  deleteTransactionCategory,
  getTransactionCategories,
  updateStatusAction
} from '@moneytracker/common/src/actions/actionCreator';
import {
  deleteTransactionCategoryFromDB,
  getTransactionCategoriesFromDB
} from '@moneytracker/common/src/api-services/api.service';
import useFetchData from '@moneytracker/common/src/customHooks/useFetchData';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import { TransactionCategoriesPageProps } from './interface';
import Loader from '../../components/Loader';
import { FETCH_STATES } from '../../reducers/DataReducer';

const TransactionCategoriesPage = ({
  userId
}: TransactionCategoriesPageProps) => {
  const dispatch = useDispatch();
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  const state = useFetchData(
    getTransactionCategoriesFromDB,
    GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
    getTransactionCategories,
    null,
    userId
  );
  const debitCategories = transactionCategories.debit;
  const creditCategories = transactionCategories.credit;
  const borrowedCategories = transactionCategories.borrowed;

  const handleDeleteCategory = (type: string) => {
    return (categoryToDelete: string) => {
      let existingCategories = debitCategories;
      if (type === CREDIT_TYPE) existingCategories = creditCategories;
      if (type === BORROWED_TYPE) existingCategories = borrowedCategories;
      const updatedCategories: string[] = [...existingCategories];
      updatedCategories.splice(
        existingCategories.findIndex(
          (existingCategory: string) => existingCategory === categoryToDelete
        ),
        1
      );

      deleteTransactionCategoryFromDB(userId, updatedCategories, type).then(
        (res: any) => {
          if (res.ok) {
            dispatch(deleteTransactionCategory(categoryToDelete, type));
            dispatch(
              updateStatusAction({
                showFeedBack: true,
                msg: DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
                severity: SEVERITY_SUCCESS
              })
            );
          } else {
            dispatch(
              updateStatusAction({
                showFeedBack: true,
                msg: DELETE_TRANSACTION_CATEGORY_ERROR_MSG,
                severity: SEVERITY_ERROR
              })
            );
          }
        }
      );
    };
  };
  const isLoaderVisible =
    state?.fetchStatus?.fetching !== FETCH_STATES.RESOLVED;
  return (
    <div className={styles.transactionCategoriesPage}>
      <div className={styles.transactionCategoryCard}>
        <AddCategory title="Credit Transaction Category" type={CREDIT_TYPE} />
        <DisplayCategories
          categories={creditCategories}
          handleDeleteCategory={handleDeleteCategory(CREDIT_TYPE)}
          isLoaderVisible={isLoaderVisible}
        />
      </div>

      <div className={styles.transactionCategoryCard}>
        <AddCategory title="Debit Transaction Category" type={DEBIT_TYPE} />
        <DisplayCategories
          categories={debitCategories}
          handleDeleteCategory={handleDeleteCategory(DEBIT_TYPE)}
          isLoaderVisible={isLoaderVisible}
        />
      </div>

      <div className={styles.transactionCategoryCard}>
        <AddCategory
          title="Borrowed Transaction Category"
          type={BORROWED_TYPE}
        />
        <DisplayCategories
          categories={borrowedCategories}
          handleDeleteCategory={handleDeleteCategory(BORROWED_TYPE)}
          isLoaderVisible={isLoaderVisible}
        />
      </div>
    </div>
  );
};

export default TransactionCategoriesPage;
