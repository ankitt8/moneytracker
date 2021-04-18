import React from 'react';
import { useSelector } from 'react-redux';
import CreditDebitSummary from './CreditDebitSummary';
import styles from './styles.module.scss';

const TransactionSummary = () => {
  // @ts-ignore
  const { bank, cash } = useSelector(state => state.transactions.transactionSummary);
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;

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
    </div>
  )
}

export default TransactionSummary;
