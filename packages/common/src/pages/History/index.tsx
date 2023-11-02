import { LinearProgress } from '@material-ui/core';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import TransactionAnalysisPage from '@moneytracker/common/src/pages/TransactionAnalysisPage';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';
import useApi from '../../customHooks/useApi';
import TransactionCategoryInput from '../../components/AddTransactionModal/TransactionCategoryInput';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import { TRANSACTION_TYPES } from '../../Constants';
import { useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';
import paymentInstrument from '../../components/PaymentInstrument';
import { getFilteredTransactions } from '../../helper';
interface IHistoryPageProps {
  userId: string;
}
const FILTERS = {
  groupByDate: false,
  groupByPaymentType: false,
  groupByCategory: false
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
  const transactionsFromApiRef = useRef([]);
  const [transactionsToDisplay, setTransactionsToDisplay] = useState(
    transactionsFromApiRef.current
  );

  const [filters, setFilters] = useState({
    ...FILTERS,
    groupByPaymentType: true
  });
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    Record<TRANSACTION_TYPE, boolean>
  >(() => {
    return TRANSACTION_TYPES.reduce((acc, curr) => {
      return { ...acc, [curr]: true };
    }, {});
  });
  const PAYMENT_INSTRUMENTS = [...bankAccounts, ...creditCards];
  const [selectedPaymentInstruments, setSelectedPaymentInstruments] =
    useState(PAYMENT_INSTRUMENTS);
  const selectedTransactionTypesArray = useMemo(() => {
    const temp = [];
    for (const key in selectedTransactionTypes) {
      if (selectedTransactionTypes[key]) temp.push(key);
    }
    return temp;
  }, [selectedTransactionTypes]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const formValues = {
    startDate: null,
    endDate: null
  };
  const transactionHistoryFormSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      formValues[key] = value;
    }
    getTransactionsApi(() => {
      const getTransactionsFilter = {
        userId,
        categories: categoriesSelected,
        transactionTypes: selectedTransactionTypesArray,
        selectedBankAccounts: [],
        selectedCreditCards: [],
        ...formValues
      };
      selectedPaymentInstruments.forEach((selectedPaymentInstrument) => {
        if (bankAccounts.includes(selectedPaymentInstrument)) {
          getTransactionsFilter.selectedBankAccounts.push(
            selectedPaymentInstrument
          );
        }
        if (creditCards.includes(selectedPaymentInstrument)) {
          getTransactionsFilter.selectedCreditCards.push(
            selectedPaymentInstrument
          );
        }
        if (
          getTransactionsFilter.selectedBankAccounts.length ===
          bankAccounts.length
        ) {
          getTransactionsFilter.selectedBankAccounts = [];
        }
        if (
          getTransactionsFilter.selectedCreditCards.length ===
          bankAccounts.length
        ) {
          getTransactionsFilter.selectedCreditCards = [];
        }
      });
      return getTransactionsFromDB(getTransactionsFilter);
    });
  };
  const getTransactionsSuccessHandler = (transactions) => {
    transactionsFromApiRef.current = transactions;
    setTransactionsToDisplay(transactions);
  };
  const { apiCall: getTransactionsApi, state } = useApi(
    getTransactionsSuccessHandler
  );
  const handleFilterClick = (updatedFilters) => {
    setFilters({ ...FILTERS, ...updatedFilters });
  };
  useEffect(() => {
    console.log('useEffect', categoriesSelected);
    setTransactionsToDisplay(
      getFilteredTransactions(transactionsFromApiRef.current, {
        category: categoriesSelected
      })
    );
    // if (transactions.length > 0) {
    //   // console.log({
    //   //   categoriesSelected,
    //   //   temp: getFilteredTransactions(transactions, {
    //   //     category: categoriesSelected
    //   //   })
    //   // });
    //   setTransactions(
    //     getFilteredTransactions(transactions, { category: categoriesSelected })
    //   );
    // }
  }, [categoriesSelected]);
  return (
    <div className={styles.container}>
      <form
        onSubmit={transactionHistoryFormSubmitHandler}
        className={styles.formContainer}
      >
        <div>
          <label htmlFor="startDate">
            From
            <input type="date" name="startDate" />
          </label>

          <label htmlFor="endDate">
            To
            <input type="date" name="endDate" />
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
                    setCategoriesSelected([]);
                    setSelectedTransactionTypes(
                      (prevSelectedTransactionTypes) => {
                        return {
                          ...prevSelectedTransactionTypes,
                          [transactionType]:
                            !prevSelectedTransactionTypes[transactionType]
                        };
                      }
                    );
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
                  name="paymentInstrument"
                  value={paymentInstrument}
                  checked={selectedPaymentInstruments.includes(
                    paymentInstrument
                  )}
                  onChange={() => {
                    setSelectedPaymentInstruments(
                      (prevSelectedPaymentInstruments) => {
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
                          return temp;
                        } else {
                          // if current payment instrument clicked is not checked
                          // add in selected Payment instruments state
                          return [
                            ...prevSelectedPaymentInstruments,
                            paymentInstrument
                          ];
                        }
                      }
                    );
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
            categories={selectedTransactionTypesArray.reduce(
              (acc, curr) => [...acc, ...categoriesStore[curr]],
              []
            )}
            categoriesSelected={categoriesSelected}
            handleCategoryChange={(category) => {
              if (Array.isArray(category)) {
                setCategoriesSelected(category);
                return;
              }
              if (categoriesSelected.includes(category)) {
                const updatedCategoriesSelected = [...categoriesSelected];
                updatedCategoriesSelected.splice(
                  categoriesSelected.findIndex((val) => val === category),
                  1
                );
                setCategoriesSelected(updatedCategoriesSelected);
              } else {
                setCategoriesSelected((prevCategoriesSelected) => [
                  ...prevCategoriesSelected,
                  category
                ]);
              }
            }}
          />
        </fieldset>
        <button>Go</button>
      </form>
      {Object.entries(FILTERS).map(([filterKey]) => {
        return (
          <label key={filterKey}>
            <input
              type="radio"
              checked={filters[filterKey]}
              onChange={() =>
                handleFilterClick({ [filterKey]: !filters[filterKey] })
              }
            />
            {getFilterDisplayName(filterKey)}
          </label>
        );
      })}
      {state.loading && <LinearProgress />}
      {transactionsToDisplay && (
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
