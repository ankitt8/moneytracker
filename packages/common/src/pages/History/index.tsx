import { LinearProgress } from '@material-ui/core';

import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import TransactionAnalysisPage from '@moneytracker/common/src/pages/TransactionAnalysisPage';
import styles from './style.module.scss';
import TransactionCategoryInput from '../../components/AddTransactionModal/TransactionCategoryInput';
import { TRANSACTION_TYPES } from '../../Constants';
import { removeDuplicateFromArray } from '../../utility';
import { useHistory } from './useHistory';
interface IHistoryPageProps {
  userId: string;
}

enum DateFilters {
  currMonth = 'currMonth',
  currYear = 'currYear'
}
export default function History({ userId }: IHistoryPageProps) {
  const {
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
  } = useHistory({ userId });
  return (
    <div className={styles.container}>
      <form
        onSubmit={transactionHistoryFormSubmitHandler}
        className={styles.formContainer}
      >
        <fieldset style={{ marginTop: 5 }}>
          <label htmlFor="startDate">
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
          <button
            type="button"
            onClick={() => {
              handleDateFilterClick(DateFilters.currMonth);
            }}
          >
            Current Month
          </button>
          <button
            type="button"
            onClick={() => {
              handleDateFilterClick(DateFilters.currYear);
            }}
          >
            Current Year
          </button>
        </fieldset>
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
      {state?.loading && <LinearProgress />}
      {!state?.loading && transactionsToDisplay && (
        <TransactionSummary transactions={transactionsToDisplay} />
      )}
      {!state?.loading ? (
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
                  transactionsToDisplay[transactionsToDisplay.length - 1]?.date
                )?.toDateString()
              : ''
          }
          startDateParam={
            transactionsToDisplay?.length > 0
              ? new Date(transactionsToDisplay[0]?.date)?.toDateString()
              : ''
          }
          isNoTransactionsDateVisible={true}
        />
      ) : null}
    </div>
  );
}
