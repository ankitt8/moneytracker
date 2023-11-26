import { TransactionCategories } from '@moneytracker/common/src/components/AddTransactionModal/TransactionCategoryInput/interface';
import { TRANSACTION_TYPES } from '../Constants';
const localStorageKeys = {
  transactionCategories: 'transactionCategories',
  bankAccounts: 'bankAccounts',
  creditCards: 'creditCards'
};
const handleGetTransactionCategoriesResponse = (transactionCategories: {
  transactionCategories: TransactionCategories;
}) => {
  localStorage.setItem(
    localStorageKeys.transactionCategories,
    JSON.stringify(transactionCategories.transactionCategories)
  );
};

const handleGetBankAccountsApiResponse = (bankAccounts: string[]) => {
  localStorage.setItem(
    localStorageKeys.bankAccounts,
    JSON.stringify(bankAccounts)
  );
};

const handleGetCreditCardsApiResponse = (creditCards: string[]) => {
  localStorage.setItem(
    localStorageKeys.creditCards,
    JSON.stringify(creditCards)
  );
};

const getPersistedBankAccounts = () => {
  try {
    const temp = localStorage.getItem(localStorageKeys.bankAccounts);
    if (temp) return JSON.parse(temp);
    return [];
  } catch (e) {
    return [];
  }
};

const getPersistedCreditCards = () => {
  try {
    const temp = localStorage.getItem(localStorageKeys.creditCards);
    if (temp) return JSON.parse(temp);
    return [];
  } catch (e) {
    return [];
  }
};

const getPersistedTransactionCategories = () => {
  const defaultState = TRANSACTION_TYPES.reduce((acc, curr) => {
    return { ...acc, [curr]: [] };
  }, {});
  try {
    const temp = localStorage.getItem(localStorageKeys.transactionCategories);
    if (temp) return JSON.parse(temp);
    return defaultState;
  } catch (e) {
    return defaultState;
  }
};

export {
  handleGetTransactionCategoriesResponse,
  getPersistedBankAccounts,
  getPersistedCreditCards,
  getPersistedTransactionCategories,
  handleGetBankAccountsApiResponse,
  handleGetCreditCardsApiResponse,
  localStorageKeys
};
