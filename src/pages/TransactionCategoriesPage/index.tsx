import {
  CREDIT_TYPE,
  DEBIT_TYPE,
  DELETE_TRANSACTION_CATEGORY_ERROR_MSG,
  DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  LENT_TYPE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS
} from 'Constants';
import AddCategory from 'components/AddCategory';
import DisplayCategories from 'components/DisplayCategories';
import styles from './styles.module.scss';
import {
  deleteTransactionCategory,
  getTransactionCategories,
  updateStatusAction
} from 'actions/actionCreator';
import {
  deleteTransactionCategoryFromDB,
  getTransactionCategoriesFromDB
} from 'api-services/api.service';
import useFetchData from 'customHooks/useFetchData';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxStore } from 'reducers/interface';
import { TransactionCategoriesPageProps } from './interface';
import { FETCH_STATES } from 'reducers/DataReducer';
import { LinearProgress } from '@material-ui/core';

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
  const lentCategories = transactionCategories.lent;

  const handleDeleteCategory = (type: string) => {
    return (categoryToDelete: string) => {
      let existingCategories = debitCategories;
      if (type === CREDIT_TYPE) existingCategories = creditCategories;
      if (type === LENT_TYPE) existingCategories = lentCategories;
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
  return (
    <div className={styles.transactionCategoriesPage}>
      {state.fetching === FETCH_STATES.PENDING && <LinearProgress />}
      <div className={styles.transactionCategoryCard}>
        <AddCategory title="Credit Transaction Category" type={CREDIT_TYPE} />
        <DisplayCategories
          categories={creditCategories}
          handleDeleteCategory={handleDeleteCategory(CREDIT_TYPE)}
        />
      </div>

      <div className={styles.transactionCategoryCard}>
        <AddCategory title="Debit Transaction Category" type={DEBIT_TYPE} />
        <DisplayCategories
          categories={debitCategories}
          handleDeleteCategory={handleDeleteCategory(DEBIT_TYPE)}
        />
      </div>

      <div className={styles.transactionCategoryCard}>
        <AddCategory title="Lent Transaction Category" type={LENT_TYPE} />
        <DisplayCategories
          categories={lentCategories}
          handleDeleteCategory={handleDeleteCategory(LENT_TYPE)}
        />
      </div>
    </div>
  );
};

export default TransactionCategoriesPage;
