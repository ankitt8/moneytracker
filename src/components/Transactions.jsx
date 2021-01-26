import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import {
  getTransactionsAction, editExpenditureAction
  , editAvailableBalAction
} from '../actions/actionCreator'
import Loader from './Loader';
import { url } from '../Constants';
import DayTransactionsCard from './DayTransactionsCard';

export default function Transactions() {
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
        const response = await fetch(url.API_URL_GET_TRANSACTIONS);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // setTransactions(data);
          dispatch(getTransactionsAction(data));
          const totalExpenditure = data.reduce((acc, curr) => acc + curr.amount, 0);
          dispatch(editExpenditureAction(totalExpenditure));
          dispatch(editAvailableBalAction(-1 * totalExpenditure));
        }
        setLoader(false)
      } catch {
        console.log('Either your internet is disconnected or issue from our side');
        setLoader(false);
        setOffline(true);
        console.log(offline)
      }
    },
    [dispatch, setLoader],
  );
  transactions.sort(sortTransactionsByDate);

  let monthlyTransactions = [];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const noOfDays = getNoOfDays(year, month);

  let totalAmountPerDay = new Array(noOfDays);
  for (let i = 0; i < noOfDays; ++i) {
    monthlyTransactions[i] = [];
  }
  for (let i = 0; i < transactions.length; ++i) {
    monthlyTransactions[new Date(transactions[i].date).getDate()].push(transactions[i]);
  }
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const todayDate = date.getDate();

  const monthlyTransactionsList = [];
  for (let i = todayDate; i >= 1; --i) {
    totalAmountPerDay[i] = monthlyTransactions[i].reduce((acc, curr) => acc + parseInt(curr.amount), 0);
    monthlyTransactionsList.push((
      <li key={i}>
        <DayTransactionsCard
          date={new Date(year, month, i).toDateString()}
          transactions={monthlyTransactions[i]}
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
      componentToRender = <ul className="list">{monthlyTransactionsList}</ul>
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
