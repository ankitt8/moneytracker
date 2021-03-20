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
import { url } from 'Constants';
import DayTransactionsCard from 'components/DayTransaction';
import {
  TransactionInterface,
  debitTransaction,
  getNoOfDaysCurrentMonth,
  getTransactionCategoriesFromDB,
  checkCreditTypeTransaction,
  calculateBankCreditAmount,
  calculateBankDebitAmount,
  calculateCashCreditAmount,
  calculateCashDebitAmount,
  checkCashModeTransaction,
  checkDebitTypeTransaction,
  checkOnlineModeTransaction
} from 'helper';
import { TransactionCategory } from 'components/AddTransactionCategoryInput/interface';
import { getTransactionCategories } from 'actions/actionCreator';
import styles from './styles.module.scss';


interface InterfaceTransactionsProps {
  userId: object;
}

const Transactions: React.FC<InterfaceTransactionsProps> = ({ userId }) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const transactions = useSelector(state => state.transactions.transactions);
  const [offline, setOffline] = React.useState(false);
  const checkTransactionsChanged = (data: TransactionInterface[]) => {
    if (data?.length === transactions?.length) {
      for (let i = 0; i < transactions.length; i += 1) {
        for (const key of Object.keys(transactions[i])) {
          // @ts-ignore
          if (transactions[i][key] !== data[i][key]) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  }
  const loadTransactions = useCallback(
    async () => {
      try {
        const response = await fetch(url.API_URL_GET_TRANSACTIONS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "userId": userId })
        });
        if (response.ok) {
          const data = await response.json();
          if (checkTransactionsChanged(data)) {
            dispatch(setCreditDebitZero())

            const debitTransactions = data.filter(checkDebitTypeTransaction);
            const creditTransactions = data.filter(checkCreditTypeTransaction);

            const bankCreditTransactions = creditTransactions.filter(checkOnlineModeTransaction);
            const cashCreditTransactions = creditTransactions.filter(checkCashModeTransaction);
            const bankDebitTransactions = debitTransactions.filter(checkOnlineModeTransaction);
            const cashDebitTransactions = debitTransactions.filter(checkCashModeTransaction);

            const bankCredit = calculateBankCreditAmount(bankCreditTransactions);
            const bankDebit = calculateBankDebitAmount(bankDebitTransactions);
            const cashCredit = calculateCashCreditAmount(cashCreditTransactions);
            const cashDebit = calculateCashDebitAmount(cashDebitTransactions);

            dispatch(editBankCreditAction(bankCredit));
            dispatch(editBankDebitAction(bankDebit));

            dispatch(editCashCreditAction(cashCredit));
            dispatch(editCashDebitAction(cashDebit));

            dispatch(getTransactionsAction(data));
          }
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

    transactions.forEach((transaction: TransactionInterface) => {
      const dayTransactionIndex = new Date(transaction.date).getDate();
      dayTransactions[dayTransactionIndex].push(transaction);
    });

    for (let i = todayDate; i >= 1; --i) {
      totalAmountPerDay[i] = dayTransactions[i]
        .filter(debitTransaction)
        .reduce((acc: number, curr: TransactionInterface) => acc + curr.amount, 0);

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


