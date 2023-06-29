import LinearProgress from '@material-ui/core/LinearProgress';

import { DEBIT_TYPE } from '@moneytracker/common/src/Constants';
import TransactionsGroupedByDateCard from '@moneytracker/common/src/components/TransactionCardWrapper';
import { Transaction } from '@moneytracker/common/src/interfaces';
import styles from './styles.module.scss';
import {
  IArgs,
  ITransactionsGroupedByDateUIProps,
  TransactionsProps
} from './interface';
import { FETCH_STATES } from '@moneytracker/common/src/reducers/DataReducer';
import { useEffect } from 'react';

const Transactions = ({
  transactions,
  fetching,
  startDateParam,
  endDateParam,
  showTransactionsInAscendingOrder = false,
  isNoTransactionsDateVisible = false
}: TransactionsProps) => {
  let componentToRender;
  useEffect(() => {
    return () => {
      componentToRender = null;
    };
  }, [transactions]);
  try {
    const transactionsGroupedByDate = getTransactionsGroupedByDate({
      transactions,
      startDateParam,
      endDateParam,
      showTransactionsInAscendingOrder
    });

    componentToRender = (
      <ul className={styles.transactionsList}>
        <TransactionsGroupedByDate
          transactionsGroupedByDate={transactionsGroupedByDate}
          isNoTransactionsDateVisible={isNoTransactionsDateVisible}
        />
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
const MILLI_SECONDS_IN_24_HRS = 24 * 20 * 20 * 1000;
const isDebitTransaction = (transaction: Transaction) =>
  transaction.type === DEBIT_TYPE || transaction.type === undefined;
const getFilterDate = (startDateParam?: string, endDateParam?: string) => {
  let endDate = endDateParam;
  let startDate = startDateParam;
  let temp;
  const currentDate = new Date();
  if (!endDate) {
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).toDateString();
  } else {
    endDate = new Date(endDate).toDateString();
  }
  if (!startDate) {
    startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).toDateString();
  } else {
    startDate = new Date(startDate).toDateString();
  }
  if (new Date(endDate) < new Date(startDate)) {
    temp = endDate;
    endDate = startDate;
    startDate = temp;
  }
  return { startDate, endDate };
};
function getTransactionsGroupedByDate({
  transactions,
  startDateParam,
  endDateParam,
  showTransactionsInAscendingOrder
}: IArgs) {
  const { startDate, endDate } = getFilterDate(startDateParam, endDateParam);
  const transactionsGroupedByDate: Record<string, Transaction[]> = {};
  let date = new Date(startDate);
  if (showTransactionsInAscendingOrder) {
    while (date <= new Date(endDate)) {
      transactionsGroupedByDate[date.toDateString()] = [];
      date = new Date(date.getTime() + MILLI_SECONDS_IN_24_HRS);
    }
  } else {
    date = new Date(endDate);
    while (date >= new Date(startDate)) {
      transactionsGroupedByDate[date.toDateString()] = [];
      date = new Date(date.getTime() - MILLI_SECONDS_IN_24_HRS);
    }
  }
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate.getTime() > new Date().getTime()) return;
    const isTransactionDateInCurrentYear =
      transactionDate.getFullYear() === new Date().getFullYear();
    if (!isTransactionDateInCurrentYear) return;
    // const dayOfMonth = transactionDate.getDate();
    transactionsGroupedByDate[transactionDate.toDateString()].push(transaction);
  });
  return transactionsGroupedByDate;
}

function getDebitAmount(individualDayTransactions: Transaction[]) {
  return individualDayTransactions
    .filter(isDebitTransaction)
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);
}

function TransactionsGroupedByDate({
  transactionsGroupedByDate,
  isNoTransactionsDateVisible
}: ITransactionsGroupedByDateUIProps): null | JSX.Element {
  if (Object.entries(transactionsGroupedByDate).length === 0) return null;
  return (
    <div>
      {Object.entries(transactionsGroupedByDate).map(
        ([dateString, transactions]) => {
          const title = new Date(dateString).toDateString();
          // don't show dates greater than today's date
          if (new Date(dateString).getTime() > new Date().getTime())
            return null;
          return (
            <TransactionsGroupedByDateCard
              key={title}
              title={title}
              transactions={transactions}
              totalAmount={getDebitAmount(
                transactionsGroupedByDate[dateString]
              )}
              isNoTransactionsDateVisible={isNoTransactionsDateVisible}
            />
          );
        }
      )}
    </div>
  );
}
export default Transactions;
