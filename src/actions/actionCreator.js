import {
  ADDTRANSACTION, GETTRANSACTIONS, NEW_TRANSACTION_ADDED
} from './actionTypes';

export function createStatusAction({
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
export function createAddTransactionAction(transaction) {
  return {
    type: ADDTRANSACTION,
    transaction,
  };
}
export function createGetTransactionsAction(transactions) {
  return {
    type: GETTRANSACTIONS,
    transactions
  };
}
export function createNewTransactionAddedAction(newTransaction) {
  return {
    type: NEW_TRANSACTION_ADDED,
    newTransaction,
  };
}

