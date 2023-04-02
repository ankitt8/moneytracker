import { Action } from 'reducers/transactions/interface';
import { UserStoreInitialState } from './interface';
import {
  ADD_USER_PAYMENT_INSTRUMENT,
  DELETE_USER_BANK_ACCOUNT,
  SET_USER_PAYMENT_INSTRUMENTS
} from '../../actions/actionTypes';
import { PaymentInstruments } from '../../interfaces';

const initialState: UserStoreInitialState = {
  userId: '',
  username: '',
  bankAccounts: [],
  creditCards: []
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
    case SET_USER_PAYMENT_INSTRUMENTS: {
      return {
        ...state,
        [action.payload.flag]: action.payload.paymentInstruments
      };
    }
    case ADD_USER_PAYMENT_INSTRUMENT: {
      let newPaymentInstruments = [];
      if (action.payload.flag === PaymentInstruments.bankAccounts) {
        newPaymentInstruments = [
          ...state.bankAccounts,
          action.payload.paymentInstrumentAdded
        ];
      } else {
        newPaymentInstruments = [
          ...state.creditCards,
          action.payload.paymentInstrumentAdded
        ];
      }
      return {
        ...state,
        [action.payload.flag]: newPaymentInstruments
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
