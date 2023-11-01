import { useSelector } from 'react-redux';
import {
  BORROWED_TYPE,
  CREDIT_TYPE,
  DEBIT_TYPE,
  TRANSACTION_TYPES
} from '@moneytracker/common/src/Constants';
import { TransactionAnalysisPageProps } from './interface';

import styles from './styles.module.scss';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import { TransactionsGroupedByCategory } from '../../components/TransactionsGroupedByCategory';
import TransactionsCardWrapper from '../../components/TransactionsCardWrapper';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import Transactions from '../../components/TransactionsGroupedByDate';
import TransactionsGroupedByDate from '../../components/TransactionsGroupedByDate';

const TransactionAnalysisPage = ({
  transactionsProps,
  groupByDate = true,
  groupByPaymentType,
  groupByCategory,
  isNoTransactionsDateVisible = true,
  startDateParam,
  endDateParam,
  showTransactionsInAscendingOrder = false
}: TransactionAnalysisPageProps) => {
  // const { fetchStatus: getTransactionState } = useFetchData(
  //   getTransactionsFromDB,
  //   GET_TRANSACTIONS_FAILURE_MSG,
  //   getTransactionsAction,
  //   null,
  //   { userId }
  // );

  // const { fetchStatus: getTransactionCategoriesState } = useFetchData(
  //   getTransactionCategoriesFromDB,
  //   GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  //   getTransactionCategories,
  //   false,
  //   userId
  // );
  let transactions = transactionsProps;
  if (!transactions) {
    transactions = useSelector(
      (store: ReduxStore) => store.transactions.transactions
    );
  }
  const creditCards = useSelector(
    (store: ReduxStore) => store.user.creditCards
  );
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  // in future will give filters where based on filter applied type will be chosen
  const getTransactionsGroupedByPaymentTypeContainer = (type: string) => {
    const transactionsFilteredByPaymentType = transactions.filter(
      (transaction) => transaction.type === type
    );
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>{type.toUpperCase()} Transactions</h3>
          <h3>
            {transactionsFilteredByPaymentType.reduce(
              (totalAmount, currentTransactionObj) =>
                totalAmount + currentTransactionObj.amount,
              0
            )}
          </h3>
        </div>
        {type === BORROWED_TYPE ? (
          creditCards.map((creditCard) => {
            const transactionsGroupedByCreditCard = transactions
              .filter(({ type }) => type === BORROWED_TYPE)
              .filter(
                ({ creditCard: transactionCreditCard }) =>
                  transactionCreditCard === creditCard
              );
            return (
              <TransactionsCardWrapper
                title={creditCard}
                transactions={transactionsGroupedByCreditCard}
                totalAmount={transactionsGroupedByCreditCard.reduce(
                  (totalAmount, curr) => totalAmount + curr.amount,
                  0
                )}
                key={creditCard}
                showDate={true}
              />
            );
          })
        ) : (
          <TransactionsCardWrapper
            title={type}
            transactions={transactionsFilteredByPaymentType}
            totalAmount={transactionsFilteredByPaymentType.reduce(
              (totalAmount, curr) => totalAmount + curr.amount,
              0
            )}
            key={type}
            showDate={true}
          />
        )}
      </>
    );
  };
  if (groupByPaymentType) {
    return (
      <div className={styles.transactionAnalysisPage}>
        {TRANSACTION_TYPES.map((type) => {
          return getTransactionsGroupedByPaymentTypeContainer(type);
        })}
      </div>
    );
  }
  if (groupByCategory) {
    return (
      <div className={styles.transactionAnalysisPage}>
        <>
          <h3>All Transactions</h3>
          <TransactionsGroupedByCategory
            transactions={transactions}
            transactionCategories={transactionCategories}
            showDate={true}
          />
        </>
      </div>
    );
  }
  if (groupByDate) {
    return (
      <TransactionsGroupedByDate
        transactions={transactions}
        showTransactionsInAscendingOrder={showTransactionsInAscendingOrder}
        endDateParam={endDateParam}
        startDateParam={startDateParam}
        isNoTransactionsDateVisible={isNoTransactionsDateVisible}
      />
    );
  }
  return null;
};

export default TransactionAnalysisPage;
