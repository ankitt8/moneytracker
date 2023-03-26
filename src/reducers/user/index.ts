import { Action } from 'reducers/transactions/interface';
import { UserStoreInitialState } from './interface';
import {
  ADD_USER_BANK_ACCOUNT,
  DELETE_USER_BANK_ACCOUNT,
  SET_USER_BANK_ACCOUNTS
} from '../../actions/actionTypes';

const initialState: UserStoreInitialState = {
  userId: '',
  username: '',
  bankAccounts: []
};
const user = (
  state: UserStoreInitialState = initialState,
  action: Action
): UserStoreInitialState => {
  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      return {
        ...state,
        ...action.payload
      };
    }
    case SET_USER_BANK_ACCOUNTS: {
      return {
        ...state,
        bankAccounts: action.payload
      };
    }
    case ADD_USER_BANK_ACCOUNT: {
      return {
        ...state,
        bankAccounts: [...state.bankAccounts, action.payload]
      };
    }
    case DELETE_USER_BANK_ACCOUNT: {
      const bankAccountIndexToDelete = state.bankAccounts.findIndex(
        (bankAccount) => bankAccount === action.payload
      );
      return {
        ...state,
        bankAccounts: [...state.bankAccounts].splice(
          bankAccountIndexToDelete,
          1
        )
      };
    }
    default:
      return state;
  }
};

export default user;
