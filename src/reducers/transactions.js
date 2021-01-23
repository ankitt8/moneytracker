import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  EDIT_TRANSACTION,
} from '../actions/actionTypes';

const initialState = {
  transactions: [],
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
    default: {
      return state;
    }
  }
};
export default transactions;
