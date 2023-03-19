import {
  SET_CREDIT_DEBIT_ZERO,
  ADD_TRANSACTION,
  ADD_TRANSACTION_CATEGORY,
  DELETE_TRANSACTION,
  DELETE_TRANSACTION_CATEGORY,
  EDIT_BANK_BALANCE,
  EDIT_BANK_CREDIT,
  EDIT_BANK_DEBIT,
  EDIT_CASH_BALANCE,
  EDIT_CASH_CREDIT,
  EDIT_CASH_DEBIT,
  EDIT_TRANSACTION,
  GET_TRANSACTIONS,
  GET_TRANSACTION_CATEGORIES,
  UPDATE_STATUS
} from 'actions/actionTypes';
import { CREDIT_TYPE, DEBIT_TYPE, BORROWED_TYPE } from 'Constants';
import { TransactionsStoreInitialState, Action, Status } from './interface';

const initialState: TransactionsStoreInitialState = {
  transactions: [],
  transactionSummary: {
    bank: {
      credit: 0,
      debit: 0,
      balance: 0
    },
    cash: {
      credit: 0,
      debit: 0,
      balance: 0
    }
  },
  status: {
    showFeedBack: null,
    msg: null,
    severity: null
  },
  categories: {
    credit: [],
    debit: [],
    borrowed: []
  }
};

const transactions = (
  state = initialState,
  action: Action
): TransactionsStoreInitialState => {
  switch (action.type) {
    case SET_CREDIT_DEBIT_ZERO: {
      return {
        ...state,
        transactionSummary: {
          bank: {
            credit: 0,
            debit: 0,
            balance: 0
          },
          cash: {
            credit: 0,
            debit: 0,
            balance: 0
          }
        }
      };
    }
    case ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.payload.transaction]
      };
    }
    case GET_TRANSACTION_CATEGORIES: {
      return {
        ...state,
        categories: { ...action.payload.transactionCategories }
      };
    }
    case ADD_TRANSACTION_CATEGORY: {
      // TODO  its difficult to add a type so many changes are required at
      // different places
      // store category as a object with type and name key params
      //
      let { debit, credit, borrowed } = state.categories;
      if (action.payload.transactionType === DEBIT_TYPE) {
        debit = [...debit, action.payload.category];
      } else if (action.payload.transactionType === BORROWED_TYPE) {
        borrowed = [...borrowed, action.payload.category];
      } else {
        credit = [...credit, action.payload.category];
      }
      return {
        ...state,
        categories: { debit, credit, borrowed }
      };
    }
    case DELETE_TRANSACTION_CATEGORY: {
      const { debit, credit, borrowed } = state.categories;
      const category = action.payload.category;
      if (action.payload.transactionType === DEBIT_TYPE) {
        debit.splice(
          debit.findIndex((debitCategory) => debitCategory === category),
          1
        );
      } else if (action.payload.transactionType === CREDIT_TYPE) {
        credit.splice(
          credit.findIndex((creditCategory) => creditCategory === category),
          1
        );
      } else {
        borrowed.splice(
          borrowed.findIndex(
            (borrowedCategory) => borrowedCategory === category
          ),
          1
        );
      }
      return {
        ...state,
        categories: { ...state.categories, debit, credit, borrowed }
      };
    }
    case GET_TRANSACTIONS: {
      return {
        ...state,
        transactions: [...action.payload.transactions]
      };
    }
    case EDIT_TRANSACTION: {
      const transactions = state.transactions;
      const index = transactions.findIndex(
        (transaction) => transaction._id === action.payload.transactionId
      );
      transactions[index] = action.payload.updatedTransaction;
      return {
        ...state,
        transactions: [...transactions]
      };
    }
    case DELETE_TRANSACTION: {
      const transactionId = action.payload.transactionId;
      const transactions = state.transactions;
      const index = transactions.findIndex(
        (transaction) => transaction._id === transactionId
      );
      transactions.splice(index, 1);
      return {
        ...state,
        transactions: [...transactions]
      };
    }
    case UPDATE_STATUS: {
      return {
        ...state,
        status: action.payload as Status
      };
    }
    case EDIT_BANK_CREDIT: {
      const credit =
        state.transactionSummary.bank.credit + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          bank: { ...state.transactionSummary.bank, credit }
        }
      };
    }
    case EDIT_BANK_DEBIT: {
      const debit = state.transactionSummary.bank.debit + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          bank: { ...state.transactionSummary.bank, debit }
        }
      };
    }
    case EDIT_BANK_BALANCE: {
      const balance =
        state.transactionSummary.bank.balance + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          bank: { ...state.transactionSummary.bank, balance }
        }
      };
    }
    case EDIT_CASH_CREDIT: {
      const credit =
        state.transactionSummary.cash.credit + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          cash: { ...state.transactionSummary.cash, credit }
        }
      };
    }
    case EDIT_CASH_DEBIT: {
      const debit = state.transactionSummary.cash.debit + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          cash: { ...state.transactionSummary.cash, debit }
        }
      };
    }
    case EDIT_CASH_BALANCE: {
      const balance =
        state.transactionSummary.cash.balance + action.payload.amount;
      return {
        ...state,
        transactionSummary: {
          ...state.transactionSummary,
          cash: { ...state.transactionSummary.cash, balance }
        }
      };
    }
    default: {
      return state;
    }
  }
};
export default transactions;
