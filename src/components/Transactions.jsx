import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import TransactionCard from './TransactionCardv1';
import { useDispatch } from 'react-redux'
import { createGetTransactionsAction } from '../actions/actionCreator'

export default function Transactions() {
  const devuri = `http://localhost:8080/api/get_transactions`;
  const produri = 'https://moneytrackerbackend.herokuapp.com/api/get_transactions';
  const dispatch = useDispatch();
  const storeTransactions = useSelector(state => state.transactions.transactions);
  const [transactions, setTransactions] = React.useState(storeTransactions);
  // setTransactions([...storeTransactions]);
  if (transactions !== storeTransactions) setTransactions(storeTransactions)

  // when the component is rendered first time the useEffect will bring the transactions
  const loadTransactions = useCallback(
    async () => {
      const response = await fetch(produri);
      const data = await response.json();
      // setTransactions(data);
      dispatch(createGetTransactionsAction(data));
    },
    [setTransactions, produri],
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
    const { heading, amount } = transaction;
    return <li key={transaction['date']}>
      <TransactionCard heading={heading} amount={amount} />
    </li>
  })

  return (
    <div>
      <div className="transactions-heading">
        <h2>Title</h2>
        <h2>Amount</h2>
      </div>
      <ul className="list">{transactionsList}</ul>
    </div>
  )
}