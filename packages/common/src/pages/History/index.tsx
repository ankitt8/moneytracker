import { LinearProgress } from '@material-ui/core';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import TransactionAnalysisPage from '@moneytracker/common/src/pages/TransactionAnalysisPage';
import { useMemo, useState } from 'react';
import styles from './style.module.scss';
import useApi from '../../customHooks/useApi';
import TransactionCategoryInput from '../../components/AddTransactionModal/TransactionCategoryInput';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import Transactions from '../../components/Transactions';
import { TRANSACTION_TYPES } from '../../Constants';
import { useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';
import paymentInstrument from '../../components/PaymentInstrument';
interface IHistoryPageProps {
  userId: string;
}
export default function History({ userId }: IHistoryPageProps) {
  console.log('History', userId);
  const categoriesStore = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  const bankAccounts = useSelector(
    (store: ReduxStore) => store.user.bankAccounts
  );
  const creditCards = useSelector(
    (store: ReduxStore) => store.user.creditCards
  );
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    groupByDate: false,
    groupByCategory: true
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
  console.log({ selectedPaymentInstruments });
  const selectedTransactionTypesArray = useMemo(() => {
    console.log('useMemo', selectedTransactionTypes);
    const temp = [];
    for (const key in selectedTransactionTypes) {
      if (selectedTransactionTypes[key]) temp.push(key);
    }
    return temp;
  }, [selectedTransactionTypes]);
  console.log(selectedTransactionTypesArray);
  const [categoriesSelected, setCategorySelected] = useState<string[]>([]);
  const formValues = {
    startDate: null,
    endDate: null
  };
  const transactionHistoryFormSubmitHandler = (e) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target);
    console.log(formData);
    for (const [key, value] of formData) {
      formValues[key] = value;
    }
    console.log(formValues);
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
      });
      return getTransactionsFromDB(getTransactionsFilter);
    });
  };
  const getTransactionsSuccessHandler = (transactions) => {
    setTransactions(transactions);
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
                          console.log(temp);
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
              if (categoriesSelected.includes(category)) {
                const updatedCategoriesSelected = [...categoriesSelected];
                updatedCategoriesSelected.splice(
                  categoriesSelected.findIndex((val) => val === category),
                  1
                );
                setCategorySelected(updatedCategoriesSelected);
              } else {
                setCategorySelected((prevCategoriesSelected) => [
                  ...prevCategoriesSelected,
                  category
                ]);
              }
            }}
          />
        </fieldset>
        <button>Go</button>
        {/*<input type="submit"/>*/}
      </form>
      <button
        onClick={() =>
          setFilters({ groupByDate: true, groupByCategory: false })
        }
      >
        Group By Date
      </button>
      <button
        onClick={() => {
          console.log('hi');
          setFilters({ groupByDate: false, groupByCategory: true });
        }}
      >
        Group By Categories
      </button>
      {state.loading && <LinearProgress />}
      {transactions && <TransactionSummary transactions={transactions} />}
      {filters.groupByDate && transactions.length > 0 ? (
        <Transactions
          transactions={transactions || []}
          showTransactionsInAscendingOrder={false}
          endDateParam={new Date(
            transactions[transactions.length - 1].date
          ).toDateString()}
          startDateParam={new Date(transactions[0].date).toDateString()}
          isNoTransactionsDateVisible={true}
        />
      ) : null}
      {filters.groupByCategory && transactions?.length > 0 ? (
        <TransactionAnalysisPage
          userId={userId}
          transactionsProps={transactions}
        />
      ) : null}
    </div>
  );
}
