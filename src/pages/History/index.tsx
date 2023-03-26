import { LinearProgress } from '@material-ui/core';
import { getTransactionsFromDB } from 'api-services/api.service';
import Transactions from 'components/Transactions';
import TransactionSummary from 'components/TransactionSummary';
import useFetchData from 'customHooks/useFetchData';
import { getCurrentMonth, getNoOfDaysMonth } from 'helper';
import TransactionAnalysisPage from 'pages/TransactionAnalysisPage';
import { useEffect, useState } from 'react';
import { FETCH_STATES } from 'reducers/DataReducer';
import { months } from './constants';
import styles from './style.module.scss';
import useApi from '../../customHooks/useApi';
const currentYear = new Date().getFullYear();
interface IHistoryPageProps {
  userId: string;
}
function History({ userId }: IHistoryPageProps) {
  const [transactions, setTransactions] = useState([]);
  const transactionTypes = ['credit', 'debit', 'borrowed'];
  const formValues = {
    startDate: null,
    endDate: null
  };
  const getTransactionsBasedOnRange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      console.log({ key, value });
      formValues[key] = value;
    }
    console.log(formValues);
    getTransactionsApi(() => getTransactionsFromDB({ userId, ...formValues }));
  };
  const getTransactionsSuccessHandler = (transactions) => {
    console.log({ transactions });
    setTransactions(transactions);
  };
  const { addDataApiCall: getTransactionsApi, state } = useApi(
    getTransactionsSuccessHandler
  );
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <form onSubmit={getTransactionsBasedOnRange}>
          <label htmlFor="startDate">From</label>
          {/* <select
            id="selectMonth"
            className={styles.dropdown}
            onChange={handleChange}
          >
            {months.map((month) => {
              return (
                <option key={month} selected={month === monthSelected}>
                  {month}
                </option>
              );
            })}
          </select> */}
          <input type="date" id="startDate" name="startDate" />
          <label htmlFor="endDate">To</label>
          <input type="date" id="endDate" name="endDate" />
          {/*{transactionTypes.map((transactionType) =>(*/}
          {/*    <input type="checkbox">*/}
          {/*)}*/}
          <button>Go</button>
        </form>
      </div>
      {state.loading && <LinearProgress />}
      {transactions && <TransactionSummary transactions={transactions} />}
      {/* <Transactions
        month={monthSelectedIndex}
        transactions={data || []}
        fetching={fetchStatus.fetching}
        showTransactionsInAscendingOrder={true}
      /> */}
      {transactions && (
        <TransactionAnalysisPage
          userId={userId}
          transactionsProps={transactions}
        />
      )}
    </div>
  );
}
export { History };
