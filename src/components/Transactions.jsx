import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import TransactionCard from './TransactionCard';
import { useDispatch } from 'react-redux'
import { getTransactionsAction } from '../actions/actionCreator'
import Loader from './Loader';
import { url } from '../Constants';
import DayTransactionsCard from './DayTransactionsCard';

export default function Transactions() {
  const dispatch = useDispatch();
  const storeTransactions = useSelector(state => state.transactions.transactions);
  const [loader, setLoader] = React.useState(true);
  const [transactions, setTransactions] = React.useState(storeTransactions);
  if (transactions !== storeTransactions) setTransactions(storeTransactions)
  function sortTransactionsByDate(a, b) {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return db - da;
  }
  const loadTransactions = useCallback(
    async () => {
      const response = await fetch(url.API_URL_GET_TRANSACTIONS);
      const data = await response.json();
      // setTransactions(data);
      dispatch(getTransactionsAction(data));
      setLoader(false);
    },
    [dispatch, setLoader],
  );
  transactions.sort(sortTransactionsByDate);
  
  let monthlyTransactions = [];
  let noOfDays = 0;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dateFirstDay = new Date(year, month, 1);
  while (dateFirstDay.getMonth() === month) {
    noOfDays += 1;
    dateFirstDay.setDate(dateFirstDay.getDate() + 1);
  }
  let totalAmountPerDay = new Array(noOfDays);
  console.log(noOfDays);
  for(let i=0;i < noOfDays; ++i) {
    monthlyTransactions[i] = [];
  }
  for (let i=0;i < transactions.length; ++i) {
    monthlyTransactions[new Date(transactions[i].date).getDate()].push(transactions[i]);
  }
  console.log(monthlyTransactions);
  console.log(totalAmountPerDay);


  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  
  const todayDate = date.getDate();

  const monthlyTransactionsList = [];
  for(let i=todayDate; i >= 1; --i) {
    totalAmountPerDay[i] = monthlyTransactions[i].reduce((acc, curr) => acc + parseInt(curr.amount),0);
    monthlyTransactionsList.push((
      <li key={i}>
        <DayTransactionsCard 
        date= {new Date(year, month, i).toDateString()}
        transactions={monthlyTransactions[i]} 
        totalAmount={totalAmountPerDay[i]}/>
      </li>
    ))
    
  }
  return (
    loader ? <Loader/> : 
    <ul className="list">{monthlyTransactionsList}</ul>
  )
}