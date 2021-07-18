import { useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { motion } from 'framer-motion';
import { DEBIT_TYPE, GET_TRANSACTIONS_FAILURE_MSG } from 'Constants';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import {
  getNoOfDaysCurrentMonth,
} from 'helper';
import {
  getTransactionsFromDB,
} from 'api-services/api.service';
import { Transaction } from 'interfaces/index.interface';
import { ReduxStore } from 'reducers/interface';
import styles from './styles.module.scss';
import { TransactionsProps } from './interface';
import useFetchData from 'customHooks/useFetchData';
import { FETCH_STATES } from 'reducers/DataReducer';
import { getTransactionsAction } from 'actions/actionCreator';

const Transactions = ({ userId }: TransactionsProps) => {
  const transactions = useSelector((store: ReduxStore) => store.transactions.transactions);
  const state = useFetchData(
    getTransactionsFromDB,
    GET_TRANSACTIONS_FAILURE_MSG,
    getTransactionsAction,
    userId
  ); 
  let componentToRender;

  try {
    const individualDayTransactions2DArray = createIndividualDayTransactions2DArray(transactions);
    const individualDayTransactionsUIArray = createIndividualDayTransactionsUIArray(individualDayTransactions2DArray);
    componentToRender = <ul className={styles.transactionsList}>{individualDayTransactionsUIArray}</ul>;
  } catch (error) {
    console.error(error);
    componentToRender = <h2>Something Broke From Our End</h2>
  }

  return (
    <>
      {state.fetching === FETCH_STATES.PENDING && <LinearProgress />}
      {componentToRender}
    </>
  );
}

const isDebitTransaction = (transaction: Transaction) => (transaction.type === DEBIT_TYPE || transaction.type === undefined);

function createIndividualDayTransactions2DArray(transactions: Transaction[]) {
  const noOfDaysCurrentMonth = getNoOfDaysCurrentMonth();
  const individualDayTransactions2DArray: Transaction[][] = [];
  for (let day = 0; day <= noOfDaysCurrentMonth; day += 1) {
    individualDayTransactions2DArray[day] = [];
  }
  transactions.forEach((transaction) => {
    const dayOfMonth = new Date(transaction.date).getDate();
    individualDayTransactions2DArray[dayOfMonth].push(transaction);
  });
  return individualDayTransactions2DArray;
}

function getIndividualDayTransactionsTotalDebitAmount(individualDayTransactions: Transaction[]) {
  return individualDayTransactions
    .filter(isDebitTransaction)
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);
}

function createIndividualDayTransactionsUIArray(individualDayTransactions2DArray: Transaction[][]) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const todayDate = date.getDate();
  const dayTransactionsCard = [];
  for (let i = todayDate; i >= 1; --i) {
    const title = new Date(year, month, i).toDateString()
    dayTransactionsCard.push((
      <motion.li
        layout
        key={i}
      >
        <DayTransactionsCard
          title={title}
          transactions={individualDayTransactions2DArray[i]}
          totalAmount={getIndividualDayTransactionsTotalDebitAmount(individualDayTransactions2DArray[i])}
        />
      </motion.li>
    ))
  }
  return dayTransactionsCard;
}

export const checkTransactionsChanged = (recentTransactions: Transaction[], storeTransactions: Transaction[]) => {
  // if length is same then check if values have changed
  // fields of transaction can be changed by doing edit operation
  if (recentTransactions.length === storeTransactions.length) {
    for (let i = 0; i < storeTransactions.length; i += 1) {
      for (const key of Object.keys(storeTransactions[i])) {
        // @ts-ignore
        if (storeTransactions[i][key] !== recentTransactions[i][key]) {
          return true;
        }
      }
    }
    return false;
  }
  // if length is different implies new transactions have been added
  return true;
}
export default Transactions;


