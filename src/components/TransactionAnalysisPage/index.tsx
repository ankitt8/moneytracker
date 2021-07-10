import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DayTransactionsCard from 'components/TransactionCardWrapper';
import { DEBIT_TYPE, SEVERITY_ERROR } from 'Constants';
import {
  isDebitTypeTransaction,
  getTransactionCategoriesFromDB,
  getTransactionsFromDB,
} from 'helper';
import { TransactionAnalysisPageProps, TransactionsGroupedByCategories, CategoryAmount } from './interface';
import { Transaction } from 'interfaces/index.interface';

import styles from './styles.module.scss';
import { getTransactionCategories, getTransactionsAction, updateStatusAction } from 'actions/actionCreator';
import Loader from 'components/Loader';
import { ReduxStore } from 'reducers/interface';
import { checkTransactionCategoriesChanged } from 'components/TransactionCategoriesPage/DisplayCategories';
import { checkTransactionsChanged } from 'components/Transactions';

const getCategoryNamesSortedByTotalAmount = (transactionsGroupedByCategories: TransactionsGroupedByCategories) => {
   const categoryTotalAmountObjectArray: CategoryAmount[] = Object.keys(transactionsGroupedByCategories).map((category: string) => ({
    category,
    totalAmount: transactionsGroupedByCategories[category]['totalAmount'],
  }));

  categoryTotalAmountObjectArray.sort((a, b) => {
    return b.totalAmount - a.totalAmount;
  });
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
  const transactions = useSelector((store: ReduxStore) => store.transactions.transactions);
  const transactionsEmpty = transactions.length === 0;
  let transactionCategories = useSelector((store: ReduxStore) => store.transactions.categories);
  const transactionCategoriesEmpty = transactionCategories.credit.length === 0 && transactionCategories.debit.length === 0;

  const [loader, setLoader] = useState(() => transactionsEmpty || transactionCategoriesEmpty);
  // if either no transactions are present in the store
  // or if no categoires are present in the store set the loader true
  // fetch the data set loader false


  let categories: string[];

  const loadTransactions = useCallback(() => {
    getTransactionsFromDB(userId)
      .then((dbTransactions) => {
        if(checkTransactionsChanged(dbTransactions, transactions)) {
          dispatch(getTransactionsAction(transactions));
        }
      })
  }, []);
  
  const loadTransactionCategories = useCallback(() => {
    window.navigator.onLine && getTransactionCategoriesFromDB(userId)
      .then(({ transactionCategories: dbTransactionCategories }) => {
        if(checkTransactionCategoriesChanged(dbTransactionCategories, transactionCategories)) {
          dispatch(getTransactionCategories(dbTransactionCategories));
        }
      });
  }, []);


  useEffect(() => {
    if(window.navigator.onLine) {
      // if user directly visits transaction analysis page 
      // transactions and categories might not be in sync if user adds transactions in other device
      try {
        loadTransactions();
        loadTransactionCategories();
      } catch {
        dispatch(updateStatusAction({
          showFeedBack: true,
          msg: 'Failed to fetch Transactions and Transaction Categories',
          severity: SEVERITY_ERROR
        }));
      } finally {
        setLoader(false);
      }
      
    }

  }, []);

  // in future will give filters where based on filter applied type will be choose

  const type = DEBIT_TYPE;
  let componentToRender;
  transactions.filter(isDebitTypeTransaction)
  let filteredTransactions = getDebitTransactions(transactions);
  categories = type === DEBIT_TYPE ? transactionCategories.debit : transactionCategories.credit;

  if (loader) {
    componentToRender = <Loader />;
  } else if (filteredTransactions.length === 0) {
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
  return componentToRender;
}

export default TransactionAnalysisPage;