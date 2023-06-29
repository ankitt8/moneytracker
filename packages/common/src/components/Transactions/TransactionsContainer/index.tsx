import { getTransactionsAction } from '@moneytracker/common/src/actions/actionCreator';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import { GET_TRANSACTIONS_FAILURE_MSG } from '@moneytracker/common/src/Constants';
import useFetchData from '@moneytracker/common/src/customHooks/useFetchData';
import { useSelector } from 'react-redux';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';

import Transactions from '../index';
import { TransactionsContainerProps } from './interface';
import { FETCH_STATES } from '../../../reducers/DataReducer';

function TransactionsContainer({
  userId,
  transactions
}: TransactionsContainerProps) {
  // const transactions = useSelector(
  //   (store: ReduxStore) => store.transactions.transactions
  // );
  // const { fetchStatus } = useFetchData(
  //   getTransactionsFromDB,
  //   GET_TRANSACTIONS_FAILURE_MSG,
  //   getTransactionsAction,
  //   null,
  //   { userId }
  // );
  return (
    <Transactions
      transactions={transactions}
      fetching={FETCH_STATES.RESOLVED}
    />
  );
}
export { TransactionsContainer };
