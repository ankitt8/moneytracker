import React, { useEffect, useCallback } from 'react';
import {
  setCreditDebitZero,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction
} from 'actions/actionCreator';
import { getNoOfDaysCurrentMonth, isDebitTypeTransaction } from 'helper';
import { Transaction } from 'interfaces/index.interface';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ReduxStore } from 'reducers/interface';
import CreditDebitSummary from './CreditDebitSummary';
import styles from './styles.module.scss';
import { CREDIT_TYPE, DEBIT_TYPE, ONLINE_MODE, CASH_MODE } from 'Constants';

const isCreditTypeTransaction = (transaction: Transaction) =>
  transaction.type === CREDIT_TYPE;
const isOnlineModeTransaction = (transaction: Transaction) =>
  transaction.mode === ONLINE_MODE;
const isCashModeTransaction = (transaction: Transaction) =>
  transaction.mode === CASH_MODE;
const calculateTransactionsTotalAmount = (transactions: Transaction[]) => {
  return transactions.length === 0
    ? 0
    : transactions.reduce((acc, curr) => acc + curr.amount, 0);
};
const TransactionSummary = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (store: ReduxStore) => store.transactions.transactions
  );
  const { bank, cash } = useSelector(
    (store: ReduxStore) => store.transactions.transactionSummary
  );
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;
  const daysRemaining = getNoOfDaysRemainingCurrentMonth();
  const processTransactions = useCallback(() => {
    dispatch(setCreditDebitZero());
    const debitTransactions = transactions.filter(isDebitTypeTransaction);
    const creditTransactions = transactions.filter(isCreditTypeTransaction);

    const bankCreditTransactions = creditTransactions.filter(
      isOnlineModeTransaction
    );
    const cashCreditTransactions = creditTransactions.filter(
      isCashModeTransaction
    );
    const bankDebitTransactions = debitTransactions.filter(
      isOnlineModeTransaction
    );
    const cashDebitTransactions = debitTransactions.filter(
      isCashModeTransaction
    );

    const bankCredit = calculateTransactionsTotalAmount(bankCreditTransactions);
    const bankDebit = calculateTransactionsTotalAmount(bankDebitTransactions);
    const cashCredit = calculateTransactionsTotalAmount(cashCreditTransactions);
    const cashDebit = calculateTransactionsTotalAmount(cashDebitTransactions);

    dispatch(editBankCreditAction(bankCredit));
    dispatch(editBankDebitAction(bankDebit));

    dispatch(editCashCreditAction(cashCredit));
    dispatch(editCashDebitAction(cashDebit));
  }, [transactions]);

  useEffect(() => {
    processTransactions();
  }, [transactions]);

  return (
    <div className={styles.transactionSummary}>
      <CreditDebitSummary
        title="Bank"
        creditAmount={bankCredit}
        debitAmount={bankDebit}
      />
      <CreditDebitSummary
        title="Cash"
        creditAmount={cashCredit}
        debitAmount={cashDebit}
      />
      <div className={styles.transactionSummaryTitle}>
        <p>Spent {bankDebit + cashDebit}</p>
        <p>Days Left {daysRemaining}</p>
      </div>
    </div>
  );
};
function getNoOfDaysRemainingCurrentMonth(): number {
  return getNoOfDaysCurrentMonth() - new Date().getDate();
}
export default TransactionSummary;
