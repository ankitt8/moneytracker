import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import TransactionCard from './TransactionCard';
import { useDispatch } from 'react-redux'
import { getTransactionsAction } from '../actions/actionCreator'
import Loader from './Loader';
import { url } from '../Constants';

export default function Transactions() {
  const dispatch = useDispatch();
  const storeTransactions = useSelector(state => state.transactions.transactions);
  const [loader, setLoader] = React.useState(true);
  const [transactions, setTransactions] = React.useState(storeTransactions);
  if (transactions !== storeTransactions) setTransactions(storeTransactions)
  
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

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  function sortTransactionsByDate(a, b) {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return db - da;
  }
  const transactionsList = transactions.sort((sortTransactionsByDate)).map((transaction) => {
    return <li key={transaction._id}>
      <TransactionCard transaction={transaction} />
    </li>
  })

  return (
    loader ? <Loader/> : <div>
      <div className="transactions-heading">
        <h2>Title</h2>
        <h2>Amount</h2>
      </div>
      <ul className="list">{transactionsList}</ul>
    </div>
  )
}