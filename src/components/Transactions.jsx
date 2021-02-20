import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  getTransactionsAction,
} from '../actions/actionCreator'
import Loader from './Loader';
import {CASH_MODE, CREDIT_TYPE, DEBIT_TYPE, ONLINE_MODE, url} from '../Constants';
import DayTransactionsCard from './DayTransactionsCard';
import {debitTransaction} from '../helpers/helper'

const checkCreditTypeTransaction = (transaction) => {
  return transaction.type === CREDIT_TYPE;
}
const checkDebitTypeTransaction = (transaction) => {
  // console.log(transaction.type === DEBIT_TYPE || transaction.type === undefined)
  return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}
const checkOnlineModeTransaction = (transaction) => {
  return transaction.mode === ONLINE_MODE;
}
const checkCashModeTransaction = (transaction) => {
  return transaction.mode === CASH_MODE;
}
const calculateTotalAmount = (transactions) => {
  return transactions.length === 0 ? 0 : transactions.reduce((acc, curr) => acc + curr.amount, 0);
}
const calculateBankDebitAmount = (bankDebitTransactions) => {
  return calculateTotalAmount(bankDebitTransactions);
}
const calculateBankCreditAmount = (bankCreditTransactions) => {
  return calculateTotalAmount(bankCreditTransactions);
}
const calculateCashCreditAmount = (cashCreditTransactions) => {
  return calculateTotalAmount(cashCreditTransactions);
}
const calculateCashDebitAmount = (cashDebitTransactions) => {
  return calculateTotalAmount(cashDebitTransactions);
}

export default function Transactions({userId}) {
  const dispatch = useDispatch();
  const storeTransactions = useSelector(state => state.transactions.transactions);
  const [loader, setLoader] = React.useState(true);
  const [transactions, setTransactions] = React.useState(storeTransactions);
  const [offline, setOffline] = React.useState(false);
  if (transactions !== storeTransactions) setTransactions(storeTransactions)

  function sortTransactionsByDate(a, b) {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return db - da;
  }
  const loadTransactions = useCallback(
    async () => {
      try {
        // If there are transactions in store or if its not first day of month
        // then no need to load transactions
        // implies we need to refresh the store if its first day of month
        // also we need to refresh the store if a new user is logged in
        // or user deletes the local storage data
        // local storage is better since I am sure that in a month
        // the user will not store data more than 5MB
        // also got a overview from adding so many transactions still the value didn't cross even 1MB

        if (storeTransactions.length !== 0 && new Date().getDate() !== 1) {
          setLoader(false);
          return;
        }
        const response = await fetch(url.API_URL_GET_TRANSACTIONS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"userId": userId})
        });
        if (response.ok) {
          const data = await response.json();
          // to handle the transactions where type debit or credit is not stored
          // adding undefined match also
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
        setLoader(false);
      } catch (err) {
        // console.error(err);
        // console.log('Either your internet is disconnected or issue from our side');
        setLoader(false);
        // assuming the error will happen only if failed to get the transactions
        setOffline(true);
      }
    },
      [dispatch, setLoader, userId, storeTransactions],
  );
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  transactions.sort(sortTransactionsByDate);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const noOfDays = getNoOfDays(year, month);
  let dayTransactions = [];
  const todayDate = date.getDate();
  const dayTransactionsList = [];
  let totalAmountPerDay = new Array(noOfDays);
  for (let i = 0; i <= noOfDays; ++i) {
    dayTransactions[i] = [];
  }

  for (const transaction of transactions) {
    const dayTransactionIndex = new Date(transaction.date).getDate();
    dayTransactions[dayTransactionIndex].push(transaction);
  }
  for (let i = todayDate; i >= 1; --i) {
    totalAmountPerDay[i] = dayTransactions[i]
        .filter(debitTransaction)
        .reduce((acc, curr) => acc + curr.amount, 0);
    dayTransactionsList.push((
        <li key={i}>
          <DayTransactionsCard
              date={new Date(year, month, i).toDateString()}
              transactions={dayTransactions[i]}
              totalAmount={totalAmountPerDay[i]}/>
        </li>
    ))
  }
  let componentToRender;
  if (loader) {
    componentToRender = <Loader />;
  } else {
    if (offline) {
      componentToRender = <h2>Please check your internet connection or our servers our down :(</h2>;
    } else {
      componentToRender = <ul className="list">{dayTransactionsList}</ul>
    }
  }
  return componentToRender;
}

function getNoOfDays(year, month) {
  let noOfDays = 0;
  const dateFirstDay = new Date(year, month, 1);
  while (dateFirstDay.getMonth() === month) {
    noOfDays += 1;
    dateFirstDay.setDate(dateFirstDay.getDate() + 1);
  }
  return noOfDays;
}


