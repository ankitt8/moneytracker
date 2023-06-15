import { getTransactionsAction } from 'actions/actionCreator';
import { getTransactionsFromDB } from 'api-services/api.service';
import { GET_TRANSACTIONS_FAILURE_MSG } from 'Constants';
import useFetchData from 'customHooks/useFetchData';
import { useSelector } from 'react-redux';
import { ReduxStore } from 'reducers/interface';

import Transactions from '..';
import { TransactionsContainerProps } from './interface';

function TransactionsContainer({ userId }: TransactionsContainerProps) {
  const transactions = useSelector(
    (store: ReduxStore) => store.transactions.transactions
  );
  console.log( ' ');
  const { fetchStatus } = useFetchData(
    getTransactionsFromDB,
    GET_TRANSACTIONS_FAILURE_MSG,
    getTransactionsAction,
    null,
    { userId }
  );
  return (
    <Transactions transactions={transactions} fetching={fetchStatus.fetching} />
  );
}
export { TransactionsContainer };
