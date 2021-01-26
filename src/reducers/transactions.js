import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  EDIT_TRANSACTION,
  EDIT_EXPENDITURE,
  EDIT_AVAILABLE_BAL,
  DELETE_TRANSACTION,
  UPDATE_STATUS
} from '../actions/actionTypes';

const initialState = {
  transactions: [],

  transactionSummary: {
    totalExpenditure: 0,
    availableBal: 41500,
    moneyCredited: 41500,
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
      console.log(index);
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
    case EDIT_EXPENDITURE: {
      const totalExpenditure = state.transactionSummary.totalExpenditure + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, totalExpenditure }
      }
    }
    case EDIT_AVAILABLE_BAL: {
      const availableBal = state.transactionSummary.availableBal + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, availableBal }
      }
    }
    default: {
      return state;
    }
  }
};
export default transactions;
