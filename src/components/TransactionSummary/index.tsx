import React from 'react';
import { getNoOfDaysRemainingCurrentMonth } from 'helper';
import { useSelector } from 'react-redux';
import { ReduxStore } from 'reducers/interface';
import CreditDebitSummary from './CreditDebitSummary';
import styles from './styles.module.scss';

const TransactionSummary = () => {
  const { bank, cash } = useSelector((state: ReduxStore) => state.transactions.transactionSummary);
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;
  const daysRemaining = getNoOfDaysRemainingCurrentMonth();
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
        <p>Spent {bankDebit + cashDebit}</p>
        <p>Days Left {daysRemaining}</p>
      </div>
    </div>
  )
}

export default TransactionSummary;
