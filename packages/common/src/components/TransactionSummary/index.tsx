import { useEffect, useCallback } from 'react';
import {
  setCreditDebitZero,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction
} from '@moneytracker/common/src/actions/actionCreator';
import {
  getNoOfDaysMonth,
  isBorrowedTypeTransaction,
  isDebitTypeTransaction
} from '@moneytracker/common/src/helper';
import { Transaction } from '@moneytracker/common/src/interfaces/index.interface';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import CreditDebitSummary from './CreditDebitSummary';
import styles from './styles.module.scss';
import {
  CREDIT_TYPE,
  ONLINE_MODE,
  CASH_MODE,
  CATEGORIES_TO_NOT_INCLUDE_IN_SUMMARY
} from '@moneytracker/common/src/Constants';
import { getFormattedAmount } from '../../utility';

const isCreditTypeTransaction = (transaction: Transaction) =>
  transaction.type === CREDIT_TYPE;
const isExcludedCategory = (transaction: Transaction): boolean => {
  return CATEGORIES_TO_NOT_INCLUDE_IN_SUMMARY.includes(transaction.category);
};
const isOnlineModeTransaction = (transaction: Transaction) =>
  transaction.mode === ONLINE_MODE;
const isCashModeTransaction = (transaction: Transaction) =>
  transaction.mode === CASH_MODE;
const calculateTransactionsTotalAmount = (transactions: Transaction[]) => {
  return transactions.length === 0
    ? 0
    : transactions.reduce((acc, curr) => acc + curr.amount, 0);
};
const TransactionSummary = ({ transactions: transactionsProps }) => {
  const dispatch = useDispatch();
  let transactions = transactionsProps;
  if (!transactions) {
    transactions = useSelector(
      (store: ReduxStore) => store.transactions.transactions
    );
  }
  const { bank, cash } = useSelector(
    (store: ReduxStore) => store.transactions.transactionSummary
  );
  const { debit: bankDebit, credit: bankCredit } = bank;
  const { debit: cashDebit, credit: cashCredit } = cash;
  const daysRemaining = getNoOfDaysRemainingCurrentMonth();
  const processTransactions = useCallback(() => {
    dispatch(setCreditDebitZero());
    // removed isExcludedCategory filter
    const debitTransactions = transactions?.filter(isDebitTypeTransaction);
    const borrowedTransactions = transactions?.filter(
      isBorrowedTypeTransaction
    );
    const creditTransactions = transactions?.filter(isCreditTypeTransaction);

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
    const borrowedAmount =
      calculateTransactionsTotalAmount(borrowedTransactions);

    dispatch(editBankCreditAction(bankCredit));
    dispatch(editBankDebitAction(bankDebit + borrowedAmount));

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
        <p>Spent {getFormattedAmount(bankDebit + cashDebit)}</p>
        <p>Days Left {daysRemaining}</p>
      </div>
    </div>
  );
};
function getNoOfDaysRemainingCurrentMonth(): number {
  return getNoOfDaysMonth() - new Date().getDate();
}
export default TransactionSummary;
