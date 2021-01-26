import React from 'react';
import TransactionCard from './TransactionCard';
export default function MonthlyTransactionCard({ transactions, date, totalAmount }) {
  const transactionsList = transactions.map((transaction) => {
    return <li key={transaction._id}>
      <TransactionCard
        transaction={transaction}
      />
    </li>
  })
  return (
    <>
      <div className="transactions-heading">
        <h2>{date}</h2>
        <h2>{totalAmount}</h2>
      </div>
      {transactions.length === 0 ? <p className="no-transaction">!!No Transactions Found!!</p> :
        <ul className="list">{transactionsList}</ul>}
    </>
  )
}
