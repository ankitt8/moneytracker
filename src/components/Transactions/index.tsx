import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  setCreditDebitZero,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  getTransactionsAction,
  updateStatusAction,
  getTransactionCategories,
} from 'actions/actionCreator';
import { CASH_MODE, CREDIT_TYPE, DEBIT_TYPE, ONLINE_MODE, SEVERITY_ERROR } from 'Constants';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import {
  getNoOfDaysCurrentMonth,
  isDebitTypeTransaction,
  getTransactionsFromDB,
  getTransactionCategoriesFromDB
} from 'helper';
import { Transaction } from 'interfaces/index.interface';
import { ReduxStore } from 'reducers/interface';
import styles from './styles.module.scss';
import { TransactionsProps } from './interface';

const isCreditTypeTransaction = (transaction: Transaction) => transaction.type === CREDIT_TYPE;
const isDebitTransaction = (transaction: Transaction) => (transaction.type === DEBIT_TYPE || transaction.type === undefined);
const isOnlineModeTransaction = (transaction: Transaction) => transaction.mode === ONLINE_MODE;
const isCashModeTransaction = (transaction: Transaction) => transaction.mode === CASH_MODE;
const calculateTransactionsTotalAmount = (transactions: Transaction[]) => {
  return transactions.length === 0 ? 0 : transactions.reduce((acc, curr) => acc + curr.amount, 0);
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
const Transactions = ({ userId }: TransactionsProps) => {
  const dispatch = useDispatch();
  const transactions = useSelector((store: ReduxStore) => store.transactions.transactions);
  const [offline, setOffline] = useState(false);
  

  const processTransactions = (transactions: Transaction[]) => {
    dispatch(setCreditDebitZero());
    const debitTransactions = transactions.filter(isDebitTypeTransaction);
    const creditTransactions = transactions.filter(isCreditTypeTransaction);

    const bankCreditTransactions = creditTransactions.filter(isOnlineModeTransaction);
    const cashCreditTransactions = creditTransactions.filter(isCashModeTransaction);
    const bankDebitTransactions = debitTransactions.filter(isOnlineModeTransaction);
    const cashDebitTransactions = debitTransactions.filter(isCashModeTransaction);

    const bankCredit = calculateTransactionsTotalAmount(bankCreditTransactions);
    const bankDebit = calculateTransactionsTotalAmount(bankDebitTransactions);
    const cashCredit = calculateTransactionsTotalAmount(cashCreditTransactions);
    const cashDebit = calculateTransactionsTotalAmount(cashDebitTransactions);

    dispatch(editBankCreditAction(bankCredit));
    dispatch(editBankDebitAction(bankDebit));

    dispatch(editCashCreditAction(cashCredit));
    dispatch(editCashDebitAction(cashDebit));

    dispatch(getTransactionsAction(transactions));
  }

  const loadTransactions = useCallback(
    async () => {
      try {
        const dbTransactions: Transaction[] = await getTransactionsFromDB(userId);
        if (checkTransactionsChanged(dbTransactions, transactions)) {
          processTransactions(dbTransactions);
        }
      } catch (err) {
        // console.error(err);
        // console.log('Either your internet is disconnected or issue from our side');
        // assuming the error will happen only if failed to get the transactions
        dispatch(updateStatusAction({
          showFeedBack: true,
          msg: 'Failed to fetch Transactions',
          severity: SEVERITY_ERROR
        }));
        setOffline(true);
      }
    },
    [],
  );
  useEffect(() => {
    !offline && loadTransactions();
    !offline &&  getTransactionCategoriesFromDB(userId)
    .then(({ transactionCategories: dbTransactionCategories }) => {
      dispatch(getTransactionCategories(dbTransactionCategories));
      // need to figure out later and dig deep why the loader was set before the 
      // https://github.com/reduxjs/react-redux/issues/1298
      // https://github.com/reduxjs/react-redux/issues/1428
      // links:- https://codesandbox.io/s/suspicious-merkle-0kzcg?file=/src/index.js
      // The below code shows No Transactions First then shown the analysiss which is bug

      // setLoader((loader) => !loader);
    });
  }, [offline]);
  let componentToRender;

  try {
    const individualDayTransactions2DArray = createIndividualDayTransactions2DArray(transactions);
    const individualDayTransactionsUIArray = createIndividualDayTransactionsUIArray(individualDayTransactions2DArray);
    componentToRender = <ul className={styles.transactionsList}>{individualDayTransactionsUIArray}</ul>;
  } catch (error) {
    console.error(error);
    componentToRender = <h2>Something Broke From Our End</h2>
    // console.error(error)
  }

  return componentToRender;
}

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
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const todayDate = new Date().getDate();
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

export default Transactions;


