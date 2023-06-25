import { LinearProgress } from '@material-ui/core';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import TransactionAnalysisPage from '@moneytracker/common/src/pages/TransactionAnalysisPage';
import { useState } from 'react';
import styles from './style.module.scss';
import useApi from '../../customHooks/useApi';
import TransactionCategoryInput from '../../components/AddTransactionModal/TransactionCategoryInput';
import { TRANSACTION_TYPE } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';
import Transactions from '../../components/Transactions';
interface IHistoryPageProps {
  userId: string;
}
function History({ userId }: IHistoryPageProps) {
  const [transactions, setTransactions] = useState([]);
  const [groupByDate, setGroupByDate] = useState(false);
  const transactionTypes: TRANSACTION_TYPE[] = [
    TRANSACTION_TYPE.credit,
    TRANSACTION_TYPE.debit,
    TRANSACTION_TYPE.borrowed
  ];
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
    getTransactionsApi(() =>
      getTransactionsFromDB({
        userId,
        category: categorySelected,
        ...formValues
      })
    );
  };
  const getTransactionsSuccessHandler = (transactions) => {
    setTransactions(transactions);
  };
  const { apiCall: getTransactionsApi, state } = useApi(
    getTransactionsSuccessHandler
  );

  const [type, setType] = useState<TRANSACTION_TYPE>(TRANSACTION_TYPE.debit);
  const [categorySelected, setCategorySelected] = useState('');
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <form onSubmit={transactionHistoryFormSubmitHandler}>
          <label htmlFor="startDate">From</label>
          <input type="date" id="startDate" name="startDate" />
          <label htmlFor="endDate">To</label>
          <input type="date" id="endDate" name="endDate" />
          <fieldset>
            <legend>Transaction Type</legend>
            <div>
              {transactionTypes.map((transactionType) => (
                <label key={transactionType}>
                  <input
                    type="checkbox"
                    id={transactionType}
                    name="transactionType"
                    value={transactionType}
                    onChange={(e) => setType(transactionType)}
                  />
                  {transactionType}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Category</legend>
            <TransactionCategoryInput
              type={type}
              categorySelected={categorySelected}
              handleCategoryChange={(category) => setCategorySelected(category)}
            />
          </fieldset>
          <button>Go</button>
        </form>
      </div>
      <button onClick={() => setGroupByDate(true)}>Group By Date</button>
      <button onClick={() => setGroupByDate(false)}>Group By Categories</button>
      {state.loading && <LinearProgress />}
      {transactions && <TransactionSummary transactions={transactions} />}
      {groupByDate && transactions.length > 0 ? (
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
      {!groupByDate && transactions?.length > 0 ? (
        <TransactionAnalysisPage
          userId={userId}
          transactionsProps={transactions}
        />
      ) : null}
    </div>
  );
}
export { History };
