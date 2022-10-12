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
function History() {
  /**
   * give option to select date range
   */
  //   const [startDate, setStartDate] = useState(new Date('1 Jun 2022'));
  //   const [endDate, setEndDate] = useState(new Date('30 Jun 2022'));
  // const [monthSelected, setMonthSelected] = useState(() => {
  //   return months[new Date().getMonth() - 1];
  // });
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  // const monthSelectedIndex = months.findIndex(
  //   (month) => month === monthSelected
  // );
  //   const [transactions, setTransactions] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  // useEffect(() => {
  //   setRefetchData({});
  // }, [monthSelected]);
  const getTransactionsBasedOnRange = () => {
    setRefetchData({});
  };
  const { fetchStatus, data } = useFetchData(
    getTransactionsFromDB,
    'Something Broke From Our End',
    null,
    refetchData,
    {
      userId: window.userId,
      startDate: new Date(dateFilter.from).toDateString(),
      endDate: new Date(dateFilter.to).toDateString()
    }
  );
  // const handleChange = (e) => {
  //   setMonthSelected(e.target.value || getCurrentMonth());
  // };
  const handleDateChange = (e, type) => {
    setDateFilter({
      ...dateFilter,
      [type]: e.target.value
    });
  };
  console.log(dateFilter);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <label htmlFor="fromDate">From</label>
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
          <input
            type="date"
            id="fromDate"
            onChange={(e) => handleDateChange(e, 'from')}
          />
          <label htmlFor="toDate">To</label>
          <input
            type="date"
            id="toDate"
            onChange={(e) => handleDateChange(e, 'to')}
          />
          <button onClick={() => getTransactionsBasedOnRange()}>Go</button>
        </div>
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
        <TransactionAnalysisPage
          userId={window.userId}
          transactionsProps={data}
        />
      )}
    </div>
  );
}
export { History };
