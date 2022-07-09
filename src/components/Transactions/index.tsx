import LinearProgress from '@material-ui/core/LinearProgress';
import { motion } from 'framer-motion';
import { DEBIT_TYPE } from 'Constants';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import { getNoOfDaysMonth } from 'helper';
import { Transaction } from 'interfaces/index.interface';
import styles from './styles.module.scss';
import { TransactionsProps } from './interface';
import { FETCH_STATES } from 'reducers/DataReducer';
import { useEffect } from 'react';

const Transactions = ({
  transactions,
  month,
  year = new Date().getFullYear(),
  fetching,
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
      createIndividualDayTransactions2DArray(transactions, month);
    const individualDayTransactionsUIArray =
      createIndividualDayTransactionsUIArray(
        individualDayTransactions2DArray,
        month,
        year,
        showTransactionsInAscendingOrder
      );
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
  month: number
) {
  const noOfDaysMonth = getNoOfDaysMonth(month);
  const individualDayTransactions2DArray: Transaction[][] = [];
  for (let day = 0; day <= noOfDaysMonth; day += 1) {
    individualDayTransactions2DArray[day] = [];
  }
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const isTransactionDateInCurrentYear =
      transactionDate.getFullYear() === new Date().getFullYear();
    if (!isTransactionDateInCurrentYear) return;
    const dayOfMonth = transactionDate.getDate();
    individualDayTransactions2DArray[dayOfMonth].push(transaction);
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
  individualDayTransactions2DArray: Transaction[][],
  month: number,
  year: number,
  showTransactionsInAscendingOrder: boolean
) {
  const date = new Date();
  const todayDate = date.getDate();

  let lastDateToShow = todayDate;
  if (month !== date.getMonth()) {
    lastDateToShow = getNoOfDaysMonth(month);
  }
  const dayTransactionsCard = [];
  function createDayTransactionsCard(title: string, i: number) {
    return (
      <motion.li layout key={i}>
        <DayTransactionsCard
          title={title}
          transactions={individualDayTransactions2DArray[i]}
          totalAmount={getIndividualDayTransactionsTotalDebitAmount(
            individualDayTransactions2DArray[i]
          )}
        />
      </motion.li>
    );
  }
  if (showTransactionsInAscendingOrder) {
    for (let i = 1; i <= lastDateToShow; i++) {
      const title = new Date(year, month, i).toDateString();
      dayTransactionsCard.push(createDayTransactionsCard(title, i));
    }
  } else {
    for (let i = lastDateToShow; i >= 1; --i) {
      const title = new Date(year, month, i).toDateString();
      dayTransactionsCard.push(createDayTransactionsCard(title, i));
    }
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
