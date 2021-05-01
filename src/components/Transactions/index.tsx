import React, { ReactElement, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  setCreditDebitZero,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  getTransactionsAction,
} from 'actions/actionCreator';
import { CASH_MODE, CREDIT_TYPE, DEBIT_TYPE, ONLINE_MODE, url } from 'Constants';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import {
  getNoOfDaysCurrentMonth,
  checkDebitTypeTransaction,
  getTransactionsFromDB
} from 'helper';
import { Transaction } from 'interfaces/index.interface';
import { ReduxStore } from 'reducers/interface';
import styles from './styles.module.scss';
import { TransactionsProps } from './interface';

const checkCreditTypeTransaction = (transaction: Transaction) => transaction.type === CREDIT_TYPE;
const debitTransaction = (transaction: Transaction) => (transaction.type === DEBIT_TYPE || transaction.type === undefined);
const checkOnlineModeTransaction = (transaction: Transaction) => transaction.mode === ONLINE_MODE;
const checkCashModeTransaction = (transaction: Transaction) => transaction.mode === CASH_MODE;
const calculateTotalAmount = (transactions: Transaction[]) => {
  return transactions.length === 0 ? 0 : transactions.reduce((acc, curr) => acc + curr.amount, 0);
}

const Transactions: React.FC<TransactionsProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state: ReduxStore) => state.transactions.transactions);
  const [offline, setOffline] = React.useState(false);
  const checkTransactionsChanged = (recentTransactions: Transaction[]) => {
    // if length is same then check if values have changed
    // fields of transaction can be changed by doing edit operation
    if (recentTransactions.length === transactions.length) {
      for (let i = 0; i < transactions.length; i += 1) {
        for (const key of Object.keys(transactions[i])) {
          // @ts-ignore
          if (transactions[i][key] !== recentTransactions[i][key]) {
            return true;
          }
        }
      }
      return false;
    }
    // if length is different implies new transactions have been added
    return true;
  }
  const loadTransactions = useCallback(
    async () => {
      try {
        const transactions: Transaction[] = await getTransactionsFromDB(userId);
        if (checkTransactionsChanged(transactions)) {
          dispatch(setCreditDebitZero())

          const debitTransactions = transactions.filter(checkDebitTypeTransaction);
          const creditTransactions = transactions.filter(checkCreditTypeTransaction);

          const bankCreditTransactions = creditTransactions.filter(checkOnlineModeTransaction);
          const cashCreditTransactions = creditTransactions.filter(checkCashModeTransaction);
          const bankDebitTransactions = debitTransactions.filter(checkOnlineModeTransaction);
          const cashDebitTransactions = debitTransactions.filter(checkCashModeTransaction);

          const bankCredit = calculateTotalAmount(bankCreditTransactions);
          const bankDebit = calculateTotalAmount(bankDebitTransactions);
          const cashCredit = calculateTotalAmount(cashCreditTransactions);
          const cashDebit = calculateTotalAmount(cashDebitTransactions);

          dispatch(editBankCreditAction(bankCredit));
          dispatch(editBankDebitAction(bankDebit));

          dispatch(editCashCreditAction(cashCredit));
          dispatch(editCashDebitAction(cashDebit));

          dispatch(getTransactionsAction(transactions));
        }
      } catch (err) {
        // console.error(err);
        // console.log('Either your internet is disconnected or issue from our side');
        // assuming the error will happen only if failed to get the transactions
        setOffline(true);
      }
    },
    [],
  );
  useEffect(() => {
    loadTransactions();
  }, []);
  let componentToRender;

  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const noOfDays: number = getNoOfDaysCurrentMonth();
    const dayTransactions: any[] = [];
    const todayDate: number = date.getDate();
    const dayTransactionsList: ReactElement[] = [];
    let totalAmountPerDay = new Array(noOfDays);

    for (let i = 0; i <= noOfDays; ++i) {
      dayTransactions[i] = [];
    }

    transactions.forEach((transaction: Transaction) => {
      const dayTransactionIndex = new Date(transaction.date).getDate();
      dayTransactions[dayTransactionIndex].push(transaction);
    });

    for (let i = todayDate; i >= 1; --i) {
      totalAmountPerDay[i] = dayTransactions[i]
        .filter(debitTransaction)
        .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

      dayTransactionsList.push(
        <motion.li
          layout
          key={new Date(year, month, i).toDateString()}
        >
          <DayTransactionsCard
            title={new Date(year, month, i).toDateString()}
            transactions={dayTransactions[i]}
            totalAmount={totalAmountPerDay[i]}
          />
        </motion.li>
      );
    }
    if (offline) {
      componentToRender = <h2>Please check your internet connection or our servers our down :(</h2>;
    } else {
      componentToRender = <ul className={styles.transactionsList}>{dayTransactionsList}</ul>
    }
  } catch (error) {
    componentToRender = <h2>Something Broke From Our End</h2>
    // console.error(error)
  }
  return componentToRender;
}

export default Transactions;


