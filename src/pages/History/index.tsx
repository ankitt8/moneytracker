import { getTransactionsFromDB } from 'api-services/api.service';
import Transactions from 'components/Transactions';
import TransactionSummary from 'components/TransactionSummary';
import useFetchData from 'customHooks/useFetchData';
import { getCurrentMonth, getNoOfDaysMonth } from 'helper';
import { useEffect, useState } from 'react';
import { months } from './constants';
import styles from './style.module.scss';
const currentYear = new Date().getFullYear();
function History() {
  /**
   * give option to select date range
   */
  //   const [startDate, setStartDate] = useState(new Date('1 Jun 2022'));
  //   const [endDate, setEndDate] = useState(new Date('30 Jun 2022'));
  const [monthSelected, setMonthSelected] = useState(() => {
    return months[new Date().getMonth() - 1];
  });
  const monthSelectedIndex = months.findIndex(
    (month) => month === monthSelected
  );
  //   const [transactions, setTransactions] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  useEffect(() => {
    setRefetchData({});
  }, [monthSelected]);

  const { fetchStatus, data } = useFetchData(
    getTransactionsFromDB,
    'Something Broke From Our End',
    null,
    refetchData,
    {
      userId: window.userId,
      startDate: new Date(`1 ${monthSelected} ${currentYear}`).toDateString(),
      endDate: new Date(
        `${getNoOfDaysMonth(
          monthSelectedIndex
        )} ${monthSelected} ${currentYear}`
      ).toDateString()
    }
  );
  const handleChange = (e) => {
    setMonthSelected(e.target.value || getCurrentMonth());
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>History</h1>
        <div>
          <label htmlFor="selectMonth">Select Month</label>
          <select
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
          </select>
        </div>
      </div>
      {data && <TransactionSummary transactions={data} />}
      <Transactions
        month={monthSelectedIndex}
        transactions={data || []}
        fetching={fetchStatus.fetching}
        showTransactionsInAscendingOrder={true}
      />
    </div>
  );
}
export { History };
