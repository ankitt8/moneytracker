import React, { useCallback, useEffect, useReducer } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import { DEBIT_TYPE, SEVERITY_ERROR } from 'Constants';
import {
  getTransactionCategoriesFromDB,
  getTransactionsFromDB,
} from 'api-services/api.service';
import {
  isDebitTypeTransaction
} from 'helper';
import { TransactionAnalysisPageProps, TransactionsGroupedByCategories, CategoryAmount } from './interface';
import { Transaction } from 'interfaces/index.interface';

import styles from './styles.module.scss';
import { getTransactionCategories, getTransactionsAction, updateStatusAction } from 'actions/actionCreator';
import { ReduxStore } from 'reducers/interface';
import { checkTransactionCategoriesChanged } from 'helper';
import { checkTransactionsChanged } from 'components/Transactions';
import { fetchingStatusReducer, fetchingStatusInitialState, FETCHING_STATES } from 'reducers/fetchingState';

const getCategoryNamesSortedByTotalAmount = (transactionsGroupedByCategories: TransactionsGroupedByCategories) => {
   const categoryTotalAmountObjectArray: CategoryAmount[] = Object.keys(transactionsGroupedByCategories).map((category: string) => ({
    category,
    totalAmount: transactionsGroupedByCategories[category]['totalAmount'],
  }));
  categoryTotalAmountObjectArray.sort((a, b) => b.totalAmount - a.totalAmount);
  return categoryTotalAmountObjectArray.map(({category}) => category);
}

const createTransactionsGroupedByCategories = (
  transactions: Transaction[], categories: string[]
) => {
  let transactionsGroupedByCategories: TransactionsGroupedByCategories = {
    'No Category': {
      transactions: [],
      totalAmount: 0,
    }
  };

  categories.forEach((category: string) => {
    transactionsGroupedByCategories[category] = {
      transactions: [],
      totalAmount: 0,
    }
  });

  transactions.forEach(transaction => {
    const { category, amount } = transaction;
    if (category === '' || category === undefined) {
      transactionsGroupedByCategories['No Category']['transactions'].push(transaction);
      transactionsGroupedByCategories['No Category'].totalAmount += amount;
    } else {
      // for now user can add transaction without category
      // reason have not yet made category required
      transactionsGroupedByCategories[category]['transactions'].push(transaction);
      transactionsGroupedByCategories[category].totalAmount += amount;
    }
  });

  return transactionsGroupedByCategories;
}

const getDebitTransactions = (transactions: Transaction[]) => transactions.filter(isDebitTypeTransaction)

const TransactionAnalysisPage = ({ userId }: TransactionAnalysisPageProps) => {
  const dispatch = useDispatch();
  const [state, fetchingStatusReducerDispatch] = useReducer(fetchingStatusReducer, fetchingStatusInitialState);
  const transactions = useSelector((store: ReduxStore) => store.transactions.transactions);
  const transactionCategories = useSelector((store: ReduxStore) => store.transactions.categories);
  let categories: string[];

  const loadData = useCallback(async () => {
    try {
      fetchingStatusReducerDispatch({type: FETCHING_STATES.PENDING});
      const [dbTransactions, { transactionCategories: dbTransactionCategories }] = await Promise.all([
        getTransactionsFromDB(userId),
        getTransactionCategoriesFromDB(userId)
      ]);
      fetchingStatusReducerDispatch({type: FETCHING_STATES.RESOLVED});
      if(checkTransactionsChanged(dbTransactions, transactions)) {
        dispatch(getTransactionsAction(transactions));
      }
      if(checkTransactionCategoriesChanged(dbTransactionCategories, transactionCategories)) {
        dispatch(getTransactionCategories(dbTransactionCategories));
      }
    } catch(error) {
      fetchingStatusReducerDispatch({type: FETCHING_STATES.REJECTED});
      dispatch(updateStatusAction({
        showFeedBack: true,
        msg: 'Failed to fetch Transactions and Transaction Categories',
        severity: SEVERITY_ERROR
      }));
    } 
    
  }, []);

  useEffect(() => {
    if(window.navigator.onLine) {
      // if user directly visits transaction analysis page 
      // transactions and categories might not be in sync if user adds transactions in other device
      loadData();
    }
  }, []);

  // in future will give filters where based on filter applied type will be choose

  const type = DEBIT_TYPE;
  let componentToRender;
  transactions.filter(isDebitTypeTransaction)
  let filteredTransactions = getDebitTransactions(transactions);
  categories = type === DEBIT_TYPE ? transactionCategories.debit : transactionCategories.credit;

  if(filteredTransactions.length === 0) {
    componentToRender = <p className={styles.noData}>!!No Transactions Found!!</p>
  } else {
    const transactionsGroupedByCategories: TransactionsGroupedByCategories =
      createTransactionsGroupedByCategories(filteredTransactions, categories);
    const categoryNamesSortedByTotalAmountDescending = getCategoryNamesSortedByTotalAmount(transactionsGroupedByCategories);
    const TransactionAnalysisCards = categoryNamesSortedByTotalAmountDescending.map((category) => (
      <motion.li
        key={category}
        layout
      >
        <DayTransactionsCard
          title={category}
          transactions={transactionsGroupedByCategories[category]['transactions']}
          totalAmount={transactionsGroupedByCategories[category]['totalAmount']}
        />
      </motion.li>
    ))
    componentToRender = <ul className={styles.transactionAnalysisPage}>{TransactionAnalysisCards}</ul>
  }
  return <>
    {state.fetching === FETCHING_STATES.PENDING && <LinearProgress />}
    {componentToRender}
    </>;
}

export default TransactionAnalysisPage;