import {
  TransactionCategories,
  TransactionCategory
} from "components/AddTransactionModal/TransactionCategoryInput/interface";
import { Transaction } from "interfaces/index.interface";
import { Status } from "reducers/transactions/interface";
import {
  SET_CREDIT_DEBIT_ZERO,
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  EDIT_BANK_BALANCE,
  EDIT_BANK_CREDIT,
  EDIT_BANK_DEBIT,
  EDIT_CASH_BALANCE,
  EDIT_CASH_CREDIT,
  EDIT_CASH_DEBIT,
  EDIT_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_STATUS,
  ADD_TRANSACTION_CATEGORY,
  DELETE_TRANSACTION_CATEGORY,
  GET_TRANSACTION_CATEGORIES,
  USER_AUTHENTICATED
} from "./actionTypes";

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
