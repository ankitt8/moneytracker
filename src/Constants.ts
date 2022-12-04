const devUrl = "http://13.127.94.162:8080";
const dev = {
  url: {
    API_URL: `${devUrl}/api/`,
    API_URL_GET_TRANSACTIONS: `${devUrl}/api/get-transactions`,
    API_URL_ADD_TRANSACTION: `${devUrl}/api/add-transaction`,
    API_URL_EDIT_TRANSACTION: `${devUrl}/api/edit-transaction`,
    API_URL_DELETE_TRANSACTION: `${devUrl}/api/delete-transaction`,
    API_URL_SIGNUP: `${devUrl}/api/signup`,
    API_URL_SIGNIN: `${devUrl}/api/signin`,
    API_URL_ADD_CREDIT_TRANSACTION_CATEGORY: `${devUrl}/api/add-credit-transaction-category`,
    API_URL_ADD_DEBIT_TRANSACTION_CATEGORY: `${devUrl}/api/add-debit-transaction-category`,
    API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY: `${devUrl}/api/delete-credit-transaction-category`,
    API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY: `${devUrl}/api/delete-debit-transaction-category`,
    API_URL_GET_TRANSACTION_CATEGORIES: `${devUrl}/api/get-transaction-categories`,
    API_URL_ADD_BANK_ACCOUNT: `${devUrl}/api/add-bank-account`,
    API_URL_EDIT_BANK_ACCOUNT: `${devUrl}/api/edit-bank-account`,
    API_URL_DELETE_BANK_ACCOUNT: `${devUrl}/api/delete-bank-account`,
    API_URL_GET_ALL_BANK_ACCOUNTS: `${devUrl}/api/get-bank-account`,
  },
};
const prodUrl = "http://13.127.94.162:8080";

const prod = {
  url: {
    API_URL: `${prodUrl}/api/`,
    API_URL_GET_TRANSACTIONS: `${prodUrl}/api/get-transactions`,
    API_URL_ADD_TRANSACTION: `${prodUrl}/api/add-transaction`,
    API_URL_EDIT_TRANSACTION: `${prodUrl}/api/edit-transaction`,
    API_URL_DELETE_TRANSACTION: `${prodUrl}/api/delete-transaction`,
    API_URL_SIGNUP: `${prodUrl}/api/signup`,
    API_URL_SIGNIN: `${prodUrl}/api/signin`,
    API_URL_ADD_CREDIT_TRANSACTION_CATEGORY: `${prodUrl}/api/add-credit-transaction-category`,
    API_URL_ADD_DEBIT_TRANSACTION_CATEGORY: `${prodUrl}/api/add-debit-transaction-category`,
    API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY: `${prodUrl}/api/delete-credit-transaction-category`,
    API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY: `${prodUrl}/api/delete-debit-transaction-category`,
    API_URL_GET_TRANSACTION_CATEGORIES: `${prodUrl}/api/get-transaction-categories`,
    API_URL_ADD_BANK_ACCOUNT: `${prodUrl}/api/add-bank-account`,
    API_URL_EDIT_BANK_ACCOUNT: `${prodUrl}/api/edit-bank-account`,
    API_URL_DELETE_BANK_ACCOUNT: `${prodUrl}/api/delete-bank-account`,
    API_URL_GET_ALL_BANK_ACCOUNTS: `${prodUrl}/api/get-bank-account`,
  },
};

export const url = process.env.NODE_ENV === `development` ? dev.url : prod.url;

export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  SPEND_ANALYSIS: "/spend-analysis",
  TRANSACTION_CATEGORIES: "/transaction-categories",
  BANK: "/bank",
  INVESTMENT: "/investment",
  FOOD_TRACKER: "/food-tracker",
  BUDGET: "/budget",
  OTHERS: "/others",
  HISTORY: "/history",
};

export const SEVERITY_SUCCESS = "success";
export const SEVERITY_WARNING = "warning";
export const SEVERITY_ERROR = "error";

export const INVALID_AMOUNT_WARNING = "Please Enter Valid Amount!";
export const INVALID_TITLE_WARNING = "Please Enter Valid Title!";
export const ADD_TRANSACTION_FAIL_ERROR = "Transaction Addition Failed :(";
export const ADD_TRANSACTION_SUCCESS_MSG = "Transaction Added Successfully :)";
export const EDIT_TRANSACTION_FAIL_ERROR = "Transaction Edit Failed :(";
export const DELETE_TRANSACTION_FAIL_ERROR = "Transaction Delete Failed :(";
export const EDIT_TRANSACTION_SUCCESS_MSG = "Transaction Edited Successfully:)";
export const DELETE_TRANSACTION_SUCCESS_MSG = "Transaction Deleted !";
export const OFFLINE_ERROR = "OOPS You Are Offline :(";

export const ADD_TRANSACTION_CATEGORY_SUCCESS_MSG =
  "Category Added Succesfully :)";
export const ADD_TRANSACTION_CATEGORY_ERROR_MSG = "Category Addition Failed :(";
export const DELETE_TRANSACTION_CATEGORY_SUCCESS_MSG = "Category Deleted !";
export const DELETE_TRANSACTION_CATEGORY_ERROR_MSG =
  "Category Delete Failed :(";
export const INVALID_CATEGORY_WARNING = "Category Addition Failed ):";

export const CASH_MODE = "cash";
export const ONLINE_MODE = "online";
export const CREDIT_TYPE = "credit";
export const DEBIT_TYPE = "debit";

export const GET_TRANSACTIONS_FAILURE_MSG = "Failed to get latest transactions";
export const GET_TRANSACTION_CATEGORIES_FAILURE_MSG =
  "Failed to get latest categories";

export const GET_BANK_ACCOUNTS_FAILURE_MSG =
  "Failed to get latest bank accounts";

export const PASSWORD_REQUIREMENT =
  "Password must be between 7 to 15 characters " +
  "which contain at least one numeric digit and a special character.";

export const bottomNavBarText = {
  home: "Home",
  analysis: "Analysis",
  categories: "Categories",
  add: "Add",
  other: "Other",
};
