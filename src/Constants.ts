const dev = {
  url: {
    API_URL: "http://localhost:8080/api/",
    API_URL_GET_TRANSACTIONS: "http://localhost:8080/api/get-transactions",
    API_URL_ADD_TRANSACTION: "http://localhost:8080/api/add-transaction",
    API_URL_EDIT_TRANSACTION: "http://localhost:8080/api/edit-transaction",
    API_URL_DELETE_TRANSACTION: "http://localhost:8080/api/delete-transaction",
    API_URL_SIGNUP: "http://localhost:8080/api/signup",
    API_URL_SIGNIN: "http://localhost:8080/api/signin",
    API_URL_ADD_CREDIT_TRANSACTION_CATEGORY:
      "http://localhost:8080/api/add-credit-transaction-category",
    API_URL_ADD_DEBIT_TRANSACTION_CATEGORY:
      "http://localhost:8080/api/add-debit-transaction-category",
    API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY:
      "http://localhost:8080/api/delete-credit-transaction-category",
    API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY:
      "http://localhost:8080/api/delete-debit-transaction-category",
    API_URL_GET_TRANSACTION_CATEGORIES:
      "http://localhost:8080/api/get-transaction-categories",
  },
};

const prod = {
  url: {
    API_URL: "https://moneytrackerbackend.herokuapp.com/api/",
    API_URL_GET_TRANSACTIONS:
      "https://moneytrackerbackend.herokuapp.com/api/get-transactions",
    API_URL_ADD_TRANSACTION:
      "https://moneytrackerbackend.herokuapp.com/api/add-transaction",
    API_URL_EDIT_TRANSACTION:
      "https://moneytrackerbackend.herokuapp.com/api/edit-transaction",
    API_URL_DELETE_TRANSACTION:
      "https://moneytrackerbackend.herokuapp.com/api/delete-transaction",
    API_URL_SIGNUP: "https://moneytrackerbackend.herokuapp.com/api/signup",
    API_URL_SIGNIN: "https://moneytrackerbackend.herokuapp.com/api/signin",
    API_URL_ADD_CREDIT_TRANSACTION_CATEGORY:
      "https://moneytrackerbackend.herokuapp.com/api/add-credit-transaction-category",
    API_URL_ADD_DEBIT_TRANSACTION_CATEGORY:
      "https://moneytrackerbackend.herokuapp.com/api/add-debit-transaction-category",
    API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY:
      "https://moneytrackerbackend.herokuapp.com/api/delete-credit-transaction-category",
    API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY:
      "https://moneytrackerbackend.herokuapp.com/api/delete-debit-transaction-category",
    API_URL_GET_TRANSACTION_CATEGORIES:
      "https://moneytrackerbackend.herokuapp.com/api/get-transaction-categories",
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

export const PASSWORD_REQUIREMENT =
  "Password must be between 7 to 15 characters " +
  "which contain at least one numeric digit and a special character.";
