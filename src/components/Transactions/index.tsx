import LinearProgress from '@material-ui/core/LinearProgress';
import { motion } from 'framer-motion';
import { DEBIT_TYPE } from 'Constants';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import { Transaction } from 'interfaces';
import styles from './styles.module.scss';
import { TransactionsProps } from './interface';
import { FETCH_STATES } from 'reducers/DataReducer';
import { useEffect } from 'react';

const Transactions = ({
  transactions,
  fetching,
  startDateParam,
  endDateParam,
  showTransactionsInAscendingOrder = false
}: TransactionsProps) => {
  let componentToRender;
  useEffect(() => {
    return () => {
      componentToRender = null;
    };
  }, [transactions]);
  try {
    const individualDayTransactions2DArray =
      createIndividualDayTransactions2DArray(
        transactions,
        startDateParam,
        endDateParam
      );
    console.log({ individualDayTransactions2DArray });
    const individualDayTransactionsUIArray =
      createIndividualDayTransactionsUIArray(
        individualDayTransactions2DArray,
        showTransactionsInAscendingOrder
      );
    console.log({ individualDayTransactionsUIArray });
    componentToRender = (
      <ul className={styles.transactionsList}>
        {individualDayTransactionsUIArray}
      </ul>
    );
  } catch (error) {
    console.error(error);
    componentToRender = <h2>Something Broke From Our End</h2>;
  }

  return (
    <>
      {fetching === FETCH_STATES.PENDING && <LinearProgress />}
      {componentToRender}
    </>
  );
};

const isDebitTransaction = (transaction: Transaction) =>
  transaction.type === DEBIT_TYPE || transaction.type === undefined;

function createIndividualDayTransactions2DArray(
  transactions: Transaction[],
  endDateParam,
  startDateParam
) {
  let endDate = endDateParam;
  let startDate = startDateParam;
  const currentDate = new Date();
  if (!endDate) {
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).toDateString();
  } else {
    endDate = new Date(endDateParam).toDateString();
  }
  if (!startDate) {
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).toDateString();
  } else {
    startDate = new Date(startDateParam).toDateString();
  }
  const individualDayTransactions2DArray: Record<string, Transaction[]> = {};
  // const date = startDate;
  let date = new Date(startDate);
  while (date <= new Date(endDate)) {
    individualDayTransactions2DArray[date.toDateString()] = [];
    date = new Date(date.getTime() + 1000 * 3600 * 24);
  }
  console.log({ individualDayTransactions2DArray });
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isTransactionDateInCurrentYear =
      transactionDate.getFullYear() === new Date().getFullYear();
    if (!isTransactionDateInCurrentYear) return;
    // const dayOfMonth = transactionDate.getDate();
    individualDayTransactions2DArray[transactionDate.toDateString()].push(
      transaction
    );
  });
  return individualDayTransactions2DArray;
}

function getIndividualDayTransactionsTotalDebitAmount(
  individualDayTransactions: Transaction[]
) {
  return individualDayTransactions
    .filter(isDebitTransaction)
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);
}

function createIndividualDayTransactionsUIArray(
  individualDayTransactions2DArray: Record<string, Transaction[]>,
  showTransactionsInAscendingOrder: boolean
) {
  const dayTransactionsCard = [];
  function createDayTransactionsCard(title: string, dateString: string) {
    return (
      <motion.li layout key={dateString}>
        <DayTransactionsCard
          title={title}
          transactions={individualDayTransactions2DArray[dateString]}
          totalAmount={getIndividualDayTransactionsTotalDebitAmount(
            individualDayTransactions2DArray[dateString]
          )}
        />
      </motion.li>
    );
  }
  if (showTransactionsInAscendingOrder) {
    console.log({ individualDayTransactions2DArray });
    console.log(Object.keys(individualDayTransactions2DArray));
    Object.keys(individualDayTransactions2DArray)
      .sort((key1, key2) => new Date(key2) > new Date(key1))
      .forEach((dateString) => {
        const title = new Date(dateString).toDateString();
        dayTransactionsCard.push(createDayTransactionsCard(title, dateString));
      });
  } else {
    Object.keys(individualDayTransactions2DArray)
      .sort((key1, key2) => new Date(key2) < new Date(key1))
      .forEach((dateString) => {
        const title = new Date(dateString).toDateString();
        dayTransactionsCard.push(createDayTransactionsCard(title, dateString));
      });
  }

  return dayTransactionsCard;
}

export const checkTransactionsChanged = (
  recentTransactions: Transaction[],
  storeTransactions: Transaction[]
) => {
  // if length is same then check if values have changed
  // fields of transaction can be changed by doing edit operation
  if (recentTransactions.length === storeTransactions.length) {
    for (let i = 0; i < storeTransactions.length; i += 1) {
      for (const key of Object.keys(storeTransactions[i])) {
        if (storeTransactions[i][key] !== recentTransactions[i][key]) {
          return true;
        }
      }
    }
    return false;
  }
  // if length is different implies new transactions have been added
  return true;
};
export default Transactions;
