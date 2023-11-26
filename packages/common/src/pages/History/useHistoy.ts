import useFetchData from '../../customHooks/useFetchData';
import {
  getPaymentInstrumentsFromDB,
  getTransactionCategoriesFromDB,
  getTransactionsFromDB
} from '../../api-services/api.service';
import { useRouter } from 'next/router';
import {
  GET_BANK_ACCOUNTS_FAILURE_MSG,
  GET_CREDIT_CARDS_FAILURE_MSG,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  TRANSACTION_TYPES
} from '../../Constants';

import { PaymentInstruments } from '../../interfaces';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  constructStartDateOfMonth,
  constructStartDateOfYear,
  constructTodayDate,
  getFlattenedCategories,
  removeDuplicateFromArray
} from '../../utility';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import { getFilteredTransactions } from '../../helper';
import useApi from '../../customHooks/useApi';
import {
  getPersistedBankAccounts,
  getPersistedCreditCards,
  getPersistedTransactionCategories,
  handleGetBankAccountsApiResponse,
  handleGetCreditCardsApiResponse,
  handleGetTransactionCategoriesResponse
} from '../../api-services/utility';
const FILTERS = {
  groupByDate: false,
  groupByPaymentType: false,
  groupByCategory: false
};
const getInitialSelectedTransactionTypes = () => {
  return TRANSACTION_TYPES.reduce((acc, curr) => {
    return { ...acc, [curr]: true };
  }, {});
};
const getFilterDisplayName = (filterKey) => {
  if (filterKey === 'groupByDate') return 'Group by date';
  if (filterKey === 'groupByPaymentType') return 'Group by payment type';
  if (filterKey === 'groupByCategory') return 'Group by category';
};
enum DateFilters {
  currMonth = 'currMonth',
  currYear = 'currYear'
}
export function useHistoy({ userId }) {
  const [categoriesStore, setCategoriesStore] = useState(() =>
    getPersistedTransactionCategories()
  );
  const [bankAccounts, setBankAccounts] = useState(() =>
    getPersistedBankAccounts()
  );
  const [creditCards, setCreditCards] = useState(() =>
    getPersistedCreditCards()
  );
  useFetchData(
    getTransactionCategoriesFromDB,
    GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
    (res) => setCategoriesStore(res.transactionCategories),
    null,
    handleGetTransactionCategoriesResponse,
    userId
  );
  useFetchData(
    getPaymentInstrumentsFromDB,
    GET_BANK_ACCOUNTS_FAILURE_MSG,
    (paymentInstruments: string[]) => setBankAccounts(paymentInstruments),
    null,
    handleGetBankAccountsApiResponse,
    userId,
    PaymentInstruments.bankAccounts
  );
  useFetchData(
    getPaymentInstrumentsFromDB,
    GET_CREDIT_CARDS_FAILURE_MSG,
    (paymentInstruments: string[]) => setCreditCards(paymentInstruments),
    null,
    handleGetCreditCardsApiResponse,
    userId,
    PaymentInstruments.creditCards
  );
  const router = useRouter();
  const transactionsFromApiRef = useRef([]);
  const [transactionsToDisplay, setTransactionsToDisplay] = useState(
    transactionsFromApiRef.current
  );
  const PAYMENT_INSTRUMENTS = [...bankAccounts, ...creditCards];
  const [filters, setFilters] = useState<any>(() => ({
    ...FILTERS,
    groupByDate: true,
    selectedTransactionTypes: getInitialSelectedTransactionTypes(),
    selectedPaymentInstruments: PAYMENT_INSTRUMENTS,
    categoriesSelected: getFlattenedCategories(categoriesStore),
    startDate: constructStartDateOfYear(),
    endDate: constructTodayDate()
  }));
  const selectedTransactionTypes = filters.selectedTransactionTypes ?? {};
  const selectedPaymentInstruments = filters.selectedPaymentInstruments;
  const selectedTransactionTypesArray: TRANSACTION_TYPE[] = useMemo(() => {
    const temp = [];
    for (const key in selectedTransactionTypes) {
      if (selectedTransactionTypes[key]) temp.push(key);
    }
    return temp;
  }, [selectedTransactionTypes]);
  const categoriesToDisplay = removeDuplicateFromArray(
    selectedTransactionTypesArray.reduce(
      (acc: string[], curr) => [...acc, ...categoriesStore[curr]],
      []
    )
  );
  const categoriesSelected = removeDuplicateFromArray(
    filters.categoriesSelected
  );
  const formValues = filters;
  useEffect(() => {
    const routerQueryParams = router.query;
    if (Object.keys(routerQueryParams).length === 0) return;
    const temp = { ...filters };
    for (const [key, value] of Object.entries(routerQueryParams)) {
      if (key && value && typeof value === 'string') {
        temp[key] = JSON.parse(value);
      }
    }
    setFilters((prevFilters) => {
      return { ...prevFilters, ...temp };
    });
    const getTransactionsFilter = { ...temp, userId };
    if (Object.keys(getTransactionsFilter).length > 0) {
      getTransactionsApi(() =>
        getTransactionsApiCallback({ ...getTransactionsFilter })
      );
    }
  }, []);
  useEffect(() => {
    setTransactionsToDisplay(
      getFilteredTransactions(transactionsFromApiRef.current, {
        category: removeDuplicateFromArray(categoriesSelected)
      })
    );
  }, [filters.categoriesSelected]);
  const getTransactionsApiCallback = (getTransactionsFilter) => {
    const updatedGetTransactionsFilter = { ...getTransactionsFilter };
    selectedPaymentInstruments?.forEach((selectedPaymentInstrument) => {
      if (bankAccounts?.includes(selectedPaymentInstrument)) {
        updatedGetTransactionsFilter?.selectedBankAccounts?.push(
          selectedPaymentInstrument
        );
      }
      if (creditCards?.includes(selectedPaymentInstrument)) {
        updatedGetTransactionsFilter?.selectedCreditCards?.push(
          selectedPaymentInstrument
        );
      }
      if (
        updatedGetTransactionsFilter?.selectedBankAccounts?.length ===
        bankAccounts.length
      ) {
        updatedGetTransactionsFilter.selectedBankAccounts = [];
      }
      if (
        updatedGetTransactionsFilter?.selectedCreditCards?.length ===
        bankAccounts.length
      ) {
        updatedGetTransactionsFilter.selectedCreditCards = [];
      }
    });
    let newUrl = '/history?';
    const getTransactionsFilterEntries = Object.entries(
      updatedGetTransactionsFilter
    );
    for (let i = 0; i < getTransactionsFilterEntries.length; i++) {
      const [key, value] = getTransactionsFilterEntries[i];
      if (value) {
        newUrl += `${key}=${JSON.stringify(value)}`;
        if (i !== getTransactionsFilterEntries.length - 1) {
          newUrl += '&';
        }
      }
    }
    window.history.pushState({}, '', `${newUrl}`);
    return getTransactionsFromDB(updatedGetTransactionsFilter);
  };
  const transactionHistoryFormSubmitHandler = (e?: any) => {
    e?.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      formValues[key] = value;
    }
    const getTransactionsFilter = {
      categoriesSelected: removeDuplicateFromArray(categoriesSelected),
      transactionTypes: selectedTransactionTypesArray,
      selectedBankAccounts: [],
      selectedCreditCards: [],
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      userId
    };

    getTransactionsApi(async () => {
      return getTransactionsApiCallback(getTransactionsFilter);
    });
  };
  const getTransactionsSuccessHandler = (transactions) => {
    transactionsFromApiRef.current = transactions;
    setTransactionsToDisplay(transactions);
  };
  const { apiCall: getTransactionsApi, state } = useApi(
    getTransactionsSuccessHandler
  );
  const handleDateFilterClick = (type: DateFilters) => {
    let startDate = '';
    if (type === DateFilters.currMonth) {
      startDate = constructStartDateOfMonth();
    } else {
      startDate = constructStartDateOfYear();
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate
    }));
    getTransactionsApi(() =>
      getTransactionsApiCallback({
        ...filters,
        startDate,
        userId
      })
    );
  };
  return {
    transactionHistoryFormSubmitHandler,
    filters,
    setFilters,
    handleDateFilterClick,
    selectedTransactionTypes,
    PAYMENT_INSTRUMENTS,
    selectedPaymentInstruments,
    categoriesToDisplay,
    categoriesSelected,
    state,
    transactionsToDisplay,
    FILTERS,
    getFilterDisplayName
  };
}
