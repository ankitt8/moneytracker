import {
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
  UPDATE_STATUS
} from './actionTypes';

export function StatusAction({
  type, started = false, successful = false, failed = false,
}) {
  return {
    type,
    status: {
      started,
      successful,
      failed,
    },
  };
}
export function addTransactionAction(transaction) {
  return {
    type: ADD_TRANSACTION,
    transaction,
  };
}
export function getTransactionsAction(transactions) {
  return {
    type: GET_TRANSACTIONS,
    transactions
  };
}
export function editTransactionAction(_id, updatedTransaction) {
  return {
    type: EDIT_TRANSACTION,
    payload: { _id, updatedTransaction }
  }
}
export function deleteTransactionAction(id) {
  return {
    type: DELETE_TRANSACTION,
    payload: id,
  }
}
export function updateStatusAction(status) {

  return {
    type: UPDATE_STATUS,
    payload: {
      addTransaction: null,
      editTransaction: null,
      deleteTransaction: null,
      isOffline: null,
      msg: null,
      severity: null,
      ...status
    },
  }
}

export function editBankCreditAction(amount) {
  return {
    type: EDIT_BANK_CREDIT,
    amount
  }
}

export function editBankDebitAction(amount) {
  return {
    type: EDIT_BANK_DEBIT,
    amount
  }
}

export function editBankBalanceAction(amount) {
  return {
    type: EDIT_BANK_BALANCE,
    amount
  }
}

export function editCashCreditAction(amount) {
  return {
    type: EDIT_CASH_CREDIT,
    amount
  }
}

export function editCashDebitAction(amount) {
  return {
    type: EDIT_CASH_DEBIT,
    amount
  }
}

export function editCashBalanceAction(amount) {
  return {
    type: EDIT_CASH_BALANCE,
    amount
  }
}

export function newUserLoggedIn(userId, username) {
  return {
    type: 'USER_AUTHENTICATED',
    payload: {
      userId,
      username
    }
  }
}