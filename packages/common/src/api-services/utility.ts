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

const getPersistedData = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return {};
  }
};

export {
  handleGetTransactionCategoriesResponse,
  getPersistedData,
  handleGetBankAccountsApiResponse,
  handleGetCreditCardsApiResponse,
  localStorageKeys
};
