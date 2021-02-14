const dev = {
  url: {
    API_URL: 'http://localhost:8080/api/',
    API_URL_GET_TRANSACTIONS: 'http://localhost:8080/api/get_transactions',
    API_URL_ADD_TRANSACTION: 'http://localhost:8080/api/add_transaction',
    API_URL_EDIT_TRANSACTION: 'http://localhost:8080/api/edit_transaction',
    API_URL_DELETE_TRANSACTION: 'http://localhost:8080/api/delete_transaction',
    API_URL_SIGNUP: 'http://localhost:8080/api/signup',
    API_URL_SIGNIN: 'http://localhost:8080/api/signin',
  }
}

const prod = {
  url: {
    API_URL: 'https://moneytrackerbackend.herokuapp.com/api/',
    API_URL_GET_TRANSACTIONS: 'https://moneytrackerbackend.herokuapp.com/api/get_transactions/',
    API_URL_ADD_TRANSACTION: 'https://moneytrackerbackend.herokuapp.com/api/add_transaction',
    API_URL_EDIT_TRANSACTION: 'https://moneytrackerbackend.herokuapp.com/api/edit_transaction',
    API_URL_DELETE_TRANSACTION: 'https://moneytrackerbackend.herokuapp.com/api/delete_transaction',
    API_URL_SIGNUP: 'https://moneytrackerbackend.herokuapp.com/api/signup',
    API_URL_SIGNIN: 'https://moneytrackerbackend.herokuapp.com/api/signin',
  }
}

export const url = process.env.NODE_ENV === `development` ? dev.url : prod.url;

export const INVALID_AMOUNT_WARNING = 'Please Enter Valid Amount!';
export const INVALID_TITLE_WARNING = 'Please Enter Valid Title!';
export const ADD_TRANSACTION_FAIL_ERROR = 'Transaction Addition Failed :(';
export const ADD_TRANSACTION_SUCCESS_MSG = 'Transaction Added Successfully:)';
export const EDIT_TRANSACTION_FAIL_ERROR = 'Transaction Edit Failed :(';
export const DELETE_TRANSACTION_FAIL_ERROR = 'Transaction Delete Failed :(';
export const EDIT_TRANSACTION_SUCCESS_MSG = 'Transaction Edited Successfully:)';
export const DELETE_TRANSACTION_SUCCESS_MSG = 'Transaction Deleted!';
export const OFFLINE_ERROR = 'OOPS You Are Offline :(';

export const CASH_MODE = 'cash';
export const ONLINE_MODE = 'online';
export const CREDIT_TYPE = 'credit';
export const DEBIT_TYPE = 'debit';

export const PASSWORD_REQUIREMENT = 'Password must be between 7 to 15 characters ' +
    'which contain at least one numeric digit and a special character.';