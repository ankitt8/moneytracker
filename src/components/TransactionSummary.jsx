import React from 'react'
import { useSelector } from 'react-redux';
export default function TransactionSummary() {
  const {totalExpenditure, availableBal, moneyCredited} = useSelector(state => state.transactions.transactionSummary);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const noOfDays = getNoOfDays(year, month);
  const daysRemaining = noOfDays - date.getDate();
  return (
    <div className="transaction-summary-card">
    	<div className="transaction-summary">
    	  <h2>Credit : {moneyCredited}</h2>
    	  <h2>Debit : {totalExpenditure}</h2>
    	</div>
      <div className="transactions-heading">
    	  <h2>Bal : {availableBal}</h2>
        <h2>DaysLeft : {daysRemaining}</h2>
    	</div>
    </div>
  )
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