import { LinearProgress } from '@material-ui/core';
import {
  getPaymentInstrumentsFromDB,
  getTransactionsFromDB
} from '@moneytracker/common/src/api-services/api.service';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import TransactionAnalysisPage from '@moneytracker/common/src/pages/TransactionAnalysisPage';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';
import useApi from '../../customHooks/useApi';
import TransactionCategoryInput from '../../components/AddTransactionModal/TransactionCategoryInput';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import {
  GET_BANK_ACCOUNTS_FAILURE_MSG,
  TRANSACTION_TYPES
} from '../../Constants';
import { useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';
import paymentInstrument from '../../components/PaymentInstrument';
import { getFilteredTransactions } from '../../helper';
import { useRouter } from 'next/router';
import useFetchData from '../../customHooks/useFetchData';
import { setUserPaymentInstrumentsAction } from '../../actions/actionCreator';
import { PaymentInstruments } from '../../interfaces';
import {
  constructStartDateOfYear,
  constructTodayDate,
  getFlattenedCategories,
  removeDuplicateFromArray
} from '../../utility';
interface IHistoryPageProps {
  userId: string;
}
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
export default function History({ userId }: IHistoryPageProps) {
  const categoriesStore = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  const bankAccounts = useSelector(
    (store: ReduxStore) => store.user.bankAccounts
  );
  const creditCards = useSelector(
    (store: ReduxStore) => store.user.creditCards
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
  const transactionHistoryFormSubmitHandler = (e) => {
    e.preventDefault();
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
  return (
    <div className={styles.container}>
      <form
        onSubmit={transactionHistoryFormSubmitHandler}
        className={styles.formContainer}
      >
        <div>
          <label htmlFor="startDate">
            From
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={(e) => {
                setFilters((prevFilters) => {
                  return { ...prevFilters, startDate: e.target.value };
                });
              }}
            />
          </label>

          <label htmlFor="endDate">
            To
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={(e) => {
                setFilters((prevFilters) => {
                  return { ...prevFilters, endDate: e.target.value };
                });
              }}
            />
          </label>
        </div>
        <fieldset>
          <legend>Transaction Type</legend>
          <div>
            {TRANSACTION_TYPES.map((transactionType) => (
              <label key={transactionType}>
                <input
                  type="checkbox"
                  name="transactionType"
                  value={transactionType}
                  checked={selectedTransactionTypes[transactionType]}
                  onChange={() => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      categoriesSelected: []
                    }));
                    setFilters((prevFilters) => {
                      const {
                        selectedTransactionTypes: prevSelectedTransactionTypes
                      } = prevFilters;
                      return {
                        ...prevFilters,
                        selectedTransactionTypes: {
                          ...prevSelectedTransactionTypes,
                          [transactionType]:
                            !prevSelectedTransactionTypes[transactionType]
                        }
                      };
                    });
                  }}
                />
                {transactionType}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Payment Instrument</legend>
          <div>
            {PAYMENT_INSTRUMENTS.map((paymentInstrument) => (
              <label key={paymentInstrument}>
                <input
                  type="checkbox"
                  value={paymentInstrument}
                  checked={selectedPaymentInstruments?.includes(
                    paymentInstrument
                  )}
                  onChange={() => {
                    setFilters((prevFilters) => {
                      const {
                        selectedPaymentInstruments:
                          prevSelectedPaymentInstruments
                      } = prevFilters;
                      // if current payment instrument clicked is already checked
                      // remove from selected Payment instruments state
                      if (
                        prevSelectedPaymentInstruments.includes(
                          paymentInstrument
                        )
                      ) {
                        const temp = [...prevSelectedPaymentInstruments];
                        temp.splice(
                          temp.findIndex((t) => t === paymentInstrument),
                          1
                        );
                        return {
                          ...prevFilters,
                          selectedPaymentInstruments: temp
                        };
                      } else {
                        // if current payment instrument clicked is not checked
                        // add in selected Payment instruments state
                        return {
                          ...prevFilters,
                          selectedPaymentInstruments: [
                            ...prevSelectedPaymentInstruments,
                            paymentInstrument
                          ]
                        };
                      }
                    });
                  }}
                />
                {paymentInstrument}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Category</legend>
          <TransactionCategoryInput
            categories={categoriesToDisplay}
            categoriesSelected={categoriesSelected}
            handleCategoryChange={(category) => {
              if (Array.isArray(category)) {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  categoriesSelected: removeDuplicateFromArray(category)
                }));
                return;
              }
              if (categoriesSelected.includes(category)) {
                const updatedCategoriesSelected = [...categoriesSelected];
                updatedCategoriesSelected.splice(
                  categoriesSelected.findIndex((val) => val === category),
                  1
                );
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  categoriesSelected: removeDuplicateFromArray(
                    updatedCategoriesSelected
                  )
                }));
              } else {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  categoriesSelected: removeDuplicateFromArray([
                    ...prevFilters.categoriesSelected,
                    category
                  ])
                }));
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  categoriesSelected: removeDuplicateFromArray([
                    ...prevFilters.categoriesSelected,
                    category
                  ])
                }));
              }
            }}
          />
        </fieldset>
        <button>Go</button>
      </form>
      <div style={{ paddingTop: 10 }}>
        {Object.entries(FILTERS).map(([filterKey]) => {
          return (
            <label key={filterKey}>
              <input
                type="radio"
                checked={filters[filterKey]}
                onChange={() => {
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    ...FILTERS,
                    ...{ [filterKey]: !prevFilters[filterKey] }
                  }));
                }}
              />
              {getFilterDisplayName(filterKey)}
            </label>
          );
        })}
      </div>
      {state.loading && <LinearProgress />}
      {!state.loading && transactionsToDisplay && (
        <TransactionSummary transactions={transactionsToDisplay} />
      )}
      <TransactionAnalysisPage
        userId={userId}
        transactionsProps={transactionsToDisplay}
        groupByPaymentType={filters.groupByPaymentType}
        groupByCategory={filters.groupByCategory}
        groupByDate={filters.groupByDate}
        showTransactionsInAscendingOrder={false}
        endDateParam={
          transactionsToDisplay?.length > 0
            ? new Date(
                transactionsToDisplay[transactionsToDisplay.length - 1].date
              ).toDateString()
            : ''
        }
        startDateParam={
          transactionsToDisplay?.length > 0
            ? new Date(transactionsToDisplay[0].date).toDateString()
            : ''
        }
        isNoTransactionsDateVisible={true}
      />
    </div>
  );
}
