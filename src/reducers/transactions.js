import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  EDIT_TRANSACTION,
  EDIT_BANK_DEBIT,
  EDIT_CASH_DEBIT,
  EDIT_BANK_BALANCE,
  DELETE_TRANSACTION,
  UPDATE_STATUS,
  EDIT_CASH_BALANCE
} from '../actions/actionTypes';

const initialState = {
  transactions: [],

  transactionSummary: {
    bank: {
      credit: 41500,
      debit: 0,
      balance: 41500,
    },
    cash: {
      credit: 1000,
      debit: 0,
      balance: 1000,
    }
  },
  status: {
    addTransaction: null,
    editTransaction: null,
    deleteTransaction: null,
    msg: null,
    severity: null,
  }
};
const transactions = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
      };
    }
    case GET_TRANSACTIONS: {
      return {
        ...state,
        transactions: [...action.transactions]
      }
    }
    case EDIT_TRANSACTION: {
      const transactions = state.transactions;
      const editTransactionId = transactions.findIndex((transaction) => transaction._id === action.payload._id);
      transactions[editTransactionId] = action.payload.updatedTransaction;
      return {
        ...state,
        transactions: [...transactions]
      }
    }
    case DELETE_TRANSACTION: {
      const deleteId = action.payload;
      const transactions = state.transactions;
      const index = transactions.findIndex((transaction) => transaction._id === deleteId);
      transactions.splice(index, 1);
      return {
        ...state,
        transactions: [...transactions],
      }
    }
    case UPDATE_STATUS: {
      return {
        ...state,
        status: {
          ...action.payload
        }
      }
    }
    case EDIT_BANK_DEBIT: {
      const debit = state.transactionSummary.bank.debit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, bank: { ...state.transactionSummary.bank, debit } }
      }
    }
    case EDIT_BANK_BALANCE: {
      const balance = state.transactionSummary.bank.balance + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, bank: { ...state.transactionSummary.bank, balance } }
      }
    }
    case EDIT_CASH_DEBIT: {
      const debit = state.transactionSummary.cash.debit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, cash: { ...state.transactionSummary.cash, debit } }
      }
    }
    case EDIT_CASH_BALANCE: {
      const balance = state.transactionSummary.cash.balance + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, cash: { ...state.transactionSummary.cash, balance } }
      }
    }
    default: {
      return state;
    }
  }
};
export default transactions;
