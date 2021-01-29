import React from 'react'
import { useSelector } from 'react-redux';
export default function TransactionSummary() {
  const { bank, cash } = useSelector(state => state.transactions.transactionSummary);
  const { debit: bankDebit, credit: bankCredit, balance: bankBalance } = bank;
  const { debit: cashDebit, credit: cashCredit, balance: cashBalance } = cash;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const noOfDays = getNoOfDays(year, month);
  const daysRemaining = noOfDays - date.getDate();
  return (
    <div className="transaction-summary-card">
      <div className="transaction-summary">
        <h2>Bank</h2>
        <h2>{bankCredit} - {bankDebit} = {bankBalance}</h2>
      </div>
      <div className="transactions-heading">
        <h2>Cash</h2>
        <h2>{cashCredit} - {cashDebit} = {cashBalance}</h2>
      </div>
      <div className="transactions-heading">
        <h2>Spent {bankDebit + cashDebit}</h2>
        <h2>Days Left {daysRemaining}</h2>
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