import React from 'react';
import { useSelector } from 'react-redux';
import CreditDebitSummary from './CreditDebitSummary';
import styles from './styles.module.scss';

const TransactionSummary = () => {
  // @ts-ignore
  const { bank, cash } = useSelector(state => state.transactions.transactionSummary);
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;
  const daysRemaining = getDaysRemaining();
  return (
    <div className={styles.transactionSummary}>
      <CreditDebitSummary
        title='Bank'
        creditAmount={bankCredit}
        debitAmount={bankDebit}
      />
      <CreditDebitSummary
        title='Cash'
        creditAmount={cashCredit}
        debitAmount={cashDebit}
      />
      <div className={styles.transactionSummaryTitle}>
        <h2>Spent {bankDebit + cashDebit}</h2>
        <h2>Days Left {daysRemaining}</h2>
      </div>
    </div>
  )
}

function getDaysRemaining() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const noOfDays = getNoOfDays(year, month);
  const daysRemaining = noOfDays - date.getDate();
  return daysRemaining;
}

function getNoOfDays(year: number, month: number) {
  let noOfDays = 0;
  const dateFirstDay = new Date(year, month, 1);
  while (dateFirstDay.getMonth() === month) {
    noOfDays += 1;
    dateFirstDay.setDate(dateFirstDay.getDate() + 1);
  }
  return noOfDays;
}
export default TransactionSummary;
