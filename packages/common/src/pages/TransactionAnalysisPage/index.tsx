import { useSelector } from 'react-redux';
import { BORROWED_TYPE, CREDIT_TYPE, DEBIT_TYPE } from '@moneytracker/common/src/Constants';
import { TransactionAnalysisPageProps } from './interface';

import styles from './styles.module.scss';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import { TransactionCards } from './TransactionCards';
import TransactionsGroupedByDateCard from '../../components/TransactionCardWrapper';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';

const TransactionAnalysisPage = ({
  userId,
  transactionsProps,
  groupByDate
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
  console.log({transactions});
  const creditCards = useSelector(
    (store: ReduxStore) => store.user.creditCards
  );
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );

  // in future will give filters where based on filter applied type will be chosen
  const getTransactionTypeCard = (type: string) => {
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
              <TransactionsGroupedByDateCard
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
          <TransactionsGroupedByDateCard
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
  return (
    <div className={styles.transactionAnalysisPage}>
      {/*{(getTransactionState.fetching === FETCH_STATES.PENDING ||*/}
      {/*  getTransactionCategoriesState.fetching === FETCH_STATES.PENDING) && (*/}
      {/*  <LinearProgress />*/}
      {/*)}*/}
      {[CREDIT_TYPE, BORROWED_TYPE, DEBIT_TYPE].map((type) => {
        return getTransactionTypeCard(type);
      })}

      {groupByDate ? (
        <>
          <h3>All Transactions</h3>
          <TransactionCards
            transactions={transactions}
            transactionCategories={transactionCategories}
            showDate={true}
          />
        </>
      ) : null}
    </div>
  );
};

export default TransactionAnalysisPage;
