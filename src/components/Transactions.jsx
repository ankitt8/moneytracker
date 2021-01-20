import React, { useEffect, useCallback } from 'react'
import TransactionCard from './TransactionCardv1';

export default function Transactions() {
  const devuri = `http://localhost:8080/api/get_transactions`;
  const produri = 'https://warm-eyrie-65343.herokuapp.com/api/get_transactions';

  const [transactions, setTransactions] = React.useState([]);
  const loadTransactions = useCallback(
    async () => {
      const response = await fetch(produri);
      const data = await response.json();
      setTransactions(data);
    },
    [setTransactions, devuri],
  );
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);
  const transactionsList = transactions.map((transaction) => {
    const { heading, amount } = transaction;
    return <li key={transaction['_id']}>
      <TransactionCard heading={heading} amount={amount} />
    </li>
  })


  console.log(transactions);
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