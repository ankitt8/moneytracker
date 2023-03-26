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
const currentYear = new Date().getFullYear();
interface IHistoryPageProps {
  userId: string;
}
function History({ userId }: IHistoryPageProps) {
  /**
   * give option to select date range
   */
  //   const [startDate, setStartDate] = useState(new Date('1 Jun 2022'));
  //   const [endDate, setEndDate] = useState(new Date('30 Jun 2022'));
  // const [monthSelected, setMonthSelected] = useState(() => {
  //   return months[new Date().getMonth() - 1];
  // });
  // const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  // const monthSelectedIndex = months.findIndex(
  //   (month) => month === monthSelected
  // );
  //   const [transactions, setTransactions] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  // useEffect(() => {
  //   setRefetchData({});
  // }, [monthSelected]);
  const transactionTypes = ['credit', 'debit', 'borrowed'];
  const formValues = {
    startDate: null,
    endDate: null
  };
  const getTransactionsBasedOnRange = (e) => {
    console.log('hi');
    e.preventDefault();
    const formData = new FormData(e.target);
    for (const [key, value] of formData) {
      console.log({ key, value });
      formValues[key] = value;
    }
    console.log(formValues);
    setRefetchData({});
  };
  console.log(formValues);
  const { fetchStatus, data } = useFetchData(
    getTransactionsFromDB,
    'Something Broke From Our End',
    null,
    refetchData,
    {
      userId: userId,
      startDate: new Date(formValues.startDate).toDateString(),
      endDate: new Date(formValues.endDate).toDateString()
    }
  );
  // const handleChange = (e) => {
  //   setMonthSelected(e.target.value || getCurrentMonth());
  // };
  // const handleDateChange = (e, type) => {
  //   setDateFilter({
  //     ...dateFilter,
  //     [type]: e.target.value
  //   });
  // };
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
      {fetchStatus.fetching === FETCH_STATES.PENDING && <LinearProgress />}
      {data && <TransactionSummary transactions={data} />}
      {/* <Transactions
        month={monthSelectedIndex}
        transactions={data || []}
        fetching={fetchStatus.fetching}
        showTransactionsInAscendingOrder={true}
      /> */}
      {data && (
        <TransactionAnalysisPage userId={userId} transactionsProps={data} />
      )}
    </div>
  );
}
export { History };
