import {
  GETTRANSACTIONS,
  ADDTRANSACTION
} from '../actions/actionTypes';

const initialState = {
  transactions: [],
};
const transactions = (state = initialState, action) => {
  switch (action.type) {
    case ADDTRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
      };
    }
    case GETTRANSACTIONS: {
      return {
        ...state,
        transactions: [...action.transactions]
      }
    }
    default: {
      return state;
    }
  }
};
export default transactions;
