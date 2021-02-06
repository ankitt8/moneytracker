import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import {
  getTransactionsAction,
  editBankBalanceAction,
  editBankDebitAction,
  editCashDebitAction,
  editCashBalanceAction
} from '../actions/actionCreator'
import Loader from './Loader';
import { CASH_MODE, ONLINE_MODE, url } from '../Constants';
import DayTransactionsCard from './DayTransactionsCard';

export default function Transactions() {

  const dispatch = useDispatch();
  const storeTransactions = useSelector(state => state.transactions.transactions);
  const [loader, setLoader] = React.useState(true);
  const [transactions, setTransactions] = React.useState(storeTransactions);
  const [offline, setOffline] = React.useState(false);
  if (transactions !== storeTransactions) setTransactions(storeTransactions)
  function sortTransactionsByDate(a, b) {
    console.log(typeof a.date)
    console.log(a.date)
    const da = new Date(a.date);
    const db = new Date(b.date);
    return db - da;
  }
  const loadTransactions = useCallback(
    async () => {
      try {
        const response = await fetch(url.API_URL_GET_TRANSACTIONS);
        if (response.ok) {
          const data = await response.json();
          dispatch(getTransactionsAction(data));

          const onlineTransactions = data.filter(
            transaction => (transaction.mode === ONLINE_MODE || transaction.mode === undefined)
          );
          const cashTransactions = data.filter(transaction => transaction.mode === CASH_MODE);

          const bankDebit = onlineTransactions.length === 0 ? 0 : onlineTransactions.reduce((acc, curr) => acc + parseInt(curr.amount), 0);
          const cashDebit = cashTransactions.length === 0 ? 0 : cashTransactions.reduce((acc, curr) => acc + parseInt(curr.amount), 0)

          dispatch(editBankDebitAction(bankDebit));
          dispatch(editBankBalanceAction(-1 * bankDebit));
          dispatch(editCashDebitAction(cashDebit));
          dispatch(editCashBalanceAction(-1 * cashDebit));
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
    [dispatch, setLoader],
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
    totalAmountPerDay[i] = dayTransactions[i].reduce((acc, curr) => acc + parseInt(curr.amount), 0);
    dayTransactionsList.push((
      <li key={i}>
        <DayTransactionsCard
          date={new Date(year, month, i).toDateString()}
          transactions={dayTransactions[i]}
          totalAmount={totalAmountPerDay[i]} />
      </li>
    ))
  }
  let componentToRender = null;
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
function getCurrentMonthTransactions(transactions) {
  const currMonth = new Date().getMonth();
  return (transactions.filter(transaction => new Date(transaction.date).getMonth() === currMonth));
}