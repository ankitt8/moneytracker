import React from 'react'
import { useSelector } from 'react-redux';
import CreditDebitSummaryAndAdd from './CreditDebitSummaryAndAdd';
import { CASH_MODE, ONLINE_MODE } from 'Constants';
import { TransactionSummaryAndAddProps } from './interface';
import styles from './styles.module.scss';

const TransactionSummaryAndAdd: React.FC<TransactionSummaryAndAddProps> = ({
  userId,
}) => {
  // @ts-ignore
  const { bank, cash } = useSelector(state => state.transactions.transactionSummary);
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;

  return (
    <div className={styles.transactionSummary}>
      <CreditDebitSummaryAndAdd
        userId={userId}
        mode={ONLINE_MODE}
        title='Bank'
        creditAmount={bankCredit}
        debitAmount={bankDebit}
      />
      <CreditDebitSummaryAndAdd
        userId={userId}
        mode={CASH_MODE}
        title='Cash'
        creditAmount={cashCredit}
        debitAmount={cashDebit}
      />
    </div>
  )
}

export default TransactionSummaryAndAdd;
