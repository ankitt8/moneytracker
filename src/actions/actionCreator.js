import {
  ADD_TRANSACTION, GET_TRANSACTIONS, EDIT_TRANSACTION, DELETE_TRANSACTION,
  EDIT_EXPENDITURE, EDIT_AVAILABLE_BAL, UPDATE_STATUS
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
      msg:null,
      severity:null,
      ...status
    },
  }
}
export function editExpenditureAction(amount) {
  return {
    type: EDIT_EXPENDITURE,
    amount
  }
}
export function editAvailableBalAction(amount) {
  return {
    type: EDIT_AVAILABLE_BAL,
    amount
  }
}
