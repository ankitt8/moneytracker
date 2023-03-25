import { Action } from 'reducers/transactions/interface';
import { UserStoreInitialState } from './interface';
import { SET_USER_BANK_ACCOUNTS } from '../../actions/actionTypes';

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
      const { userId, username } = action.payload;
      return {
        ...state,
        userId,
        username
      };
    }
    case SET_USER_BANK_ACCOUNTS: {
      return {
        ...state,
        bankAccounts: action.payload
      };
    }
    default:
      return state;
  }
};

export default user;
