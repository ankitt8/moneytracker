import {
  TransactionCategories,
  TransactionCategory
} from '@moneytracker/common/src/components/AddTransactionModal/TransactionCategoryInput/interface';
import {
  PaymentInstruments,
  Transaction
} from '@moneytracker/common/src/interfaces';
import { Status } from '@moneytracker/common/src/reducers/transactions/interface';
import {
  ADD_TRANSACTION,
  ADD_TRANSACTION_CATEGORY,
  ADD_USER_BANK_ACCOUNT,
  ADD_USER_CREDIT_CARD,
  ADD_USER_PAYMENT_INSTRUMENT,
  DELETE_TRANSACTION,
  DELETE_TRANSACTION_CATEGORY,
  DELETE_USER_BANK_ACCOUNT,
  EDIT_BANK_BALANCE,
  EDIT_BANK_CREDIT,
  EDIT_BANK_DEBIT,
  EDIT_CASH_BALANCE,
  EDIT_CASH_CREDIT,
  EDIT_CASH_DEBIT,
  EDIT_TRANSACTION,
  GET_TRANSACTION_CATEGORIES,
  GET_TRANSACTIONS,
  SET_CREDIT_DEBIT_ZERO,
  SET_USER_BANK_ACCOUNTS,
  SET_USER_CREDIT_CARDS,
  SET_USER_PAYMENT_INSTRUMENTS,
  UPDATE_STATUS,
  USER_AUTHENTICATED
} from './actionTypes';

type TransactionType = string;

export function setCreditDebitZero() {
  return {
    type: SET_CREDIT_DEBIT_ZERO
  };
}

export function addTransactionAction(transaction: Transaction) {
  return {
    type: ADD_TRANSACTION,
    payload: { transaction }
  };
}
export function getTransactionsAction(transactions: Transaction[]) {
  return {
    type: GET_TRANSACTIONS,
    payload: { transactions }
  };
}
export function editTransactionAction(
  transactionId: string,
  updatedTransaction: Transaction
) {
  return {
    type: EDIT_TRANSACTION,
    payload: { transactionId, updatedTransaction }
  };
}
export function deleteTransactionAction(transactionId: string) {
  return {
    type: DELETE_TRANSACTION,
    payload: { transactionId }
  };
}
export function updateStatusAction(status: Status) {
  return {
    type: UPDATE_STATUS,
    payload: {
      ...status
    }
  };
}

export function editBankCreditAction(amount: number) {
  return {
    type: EDIT_BANK_CREDIT,
    payload: { amount }
  };
}

export function editBankDebitAction(amount: number) {
  return {
    type: EDIT_BANK_DEBIT,
    payload: { amount }
  };
}

export function editBankBalanceAction(amount: number) {
  return {
    type: EDIT_BANK_BALANCE,
    payload: { amount }
  };
}

export function editCashCreditAction(amount: number) {
  return {
    type: EDIT_CASH_CREDIT,
    payload: { amount }
  };
}

export function editCashDebitAction(amount: number) {
  return {
    type: EDIT_CASH_DEBIT,
    payload: { amount }
  };
}

export function editCashBalanceAction(amount: number) {
  return {
    type: EDIT_CASH_BALANCE,
    payload: { amount }
  };
}

export function getTransactionCategories(
  transactionCategories: TransactionCategories
) {
  return {
    type: GET_TRANSACTION_CATEGORIES,
    payload: transactionCategories
  };
}

export function setUserPaymentInstrumentsAction(
  flag: PaymentInstruments,
  paymentInstruments: string[]
) {
  console.log(flag);
  return {
    type: SET_USER_PAYMENT_INSTRUMENTS,
    payload: { flag, paymentInstruments }
  };
}
export function addUserPaymentInstrumentAction(
  flag: PaymentInstruments,
  paymentInstrumentAdded: string
) {
  return {
    type: ADD_USER_PAYMENT_INSTRUMENT,
    payload: { flag, paymentInstrumentAdded }
  };
}
export function addTransactionCategory(
  category: TransactionCategory,
  transactionType: TransactionType
) {
  return {
    type: ADD_TRANSACTION_CATEGORY,
    payload: {
      category,
      transactionType
    }
  };
}

export function deleteTransactionCategory(
  category: TransactionCategory,
  transactionType: TransactionType
) {
  return {
    type: DELETE_TRANSACTION_CATEGORY,
    payload: {
      category,
      transactionType
    }
  };
}

export function newUserLoggedIn(userId: string, username: string) {
  return {
    type: USER_AUTHENTICATED,
    payload: {
      userId,
      username
    }
  };
}
