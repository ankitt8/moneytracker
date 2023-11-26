import { TransactionCategories } from '@moneytracker/common/src/components/AddTransactionModal/TransactionCategoryInput/interface';
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
  try {
    const temp = localStorage.getItem(localStorageKeys.transactionCategories);
    if (temp) return JSON.parse(temp);
    return {};
  } catch (e) {
    return {};
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
