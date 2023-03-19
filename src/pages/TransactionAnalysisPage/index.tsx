import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from 'react-redux';
import {
  CREDIT_TYPE,
  DEBIT_TYPE,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  GET_TRANSACTIONS_FAILURE_MSG,
  BORROWED_TYPE
} from 'Constants';
import {
  getTransactionCategoriesFromDB,
  getTransactionsFromDB
} from 'api-services/api.service';
import { TransactionAnalysisPageProps } from './interface';

import styles from './styles.module.scss';
import {
  getTransactionCategories,
  getTransactionsAction
} from 'actions/actionCreator';
import { ReduxStore } from 'reducers/interface';
import useFetchData from 'customHooks/useFetchData';
import { FETCH_STATES } from 'reducers/DataReducer';
import { TransactionCards } from './TransactionCards';

const TransactionAnalysisPage = ({
  userId,
  transactionsProps
}: TransactionAnalysisPageProps) => {
  const { fetchStatus: getTransactionState } = useFetchData(
    getTransactionsFromDB,
    GET_TRANSACTIONS_FAILURE_MSG,
    getTransactionsAction,
    null,
    { userId }
  );

  const { fetchStatus: getTransactionCategoriesState } = useFetchData(
    getTransactionCategoriesFromDB,
    GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
    getTransactionCategories,
    false,
    userId
  );
  let transactions = transactionsProps;
  if (!transactions) {
    transactions = useSelector(
      (store: ReduxStore) => store.transactions.transactions
    );
  }
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );

  // in future will give filters where based on filter applied type will be chosen

  return (
    <div className={styles.transactionAnalysisPage}>
      {(getTransactionState.fetching === FETCH_STATES.PENDING ||
        getTransactionCategoriesState.fetching === FETCH_STATES.PENDING) && (
        <LinearProgress />
      )}
      {[CREDIT_TYPE, BORROWED_TYPE, DEBIT_TYPE].map((type) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>{type.toUpperCase()} Transactions</h3>
            <h3>
              {transactions
                .filter((transaction) => transaction.type === type)
                .reduce(
                  (totalAmount, currentTransactionObj) =>
                    totalAmount + currentTransactionObj.amount,
                  0
                )}
            </h3>
          </div>

          <TransactionCards
            transactions={transactions}
            transactionCategories={transactionCategories}
            type={type}
          />
        </>
      ))}
    </div>
  );
};

export default TransactionAnalysisPage;
