import LinearProgress from "@material-ui/core/LinearProgress";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import DayTransactionsCard from "components/TransactionCardWrapper";
import {
  DEBIT_TYPE,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  GET_TRANSACTIONS_FAILURE_MSG
} from "Constants";
import {
  getTransactionCategoriesFromDB,
  getTransactionsFromDB
} from "api-services/api.service";
import { isDebitTypeTransaction } from "helper";
import { Transaction } from "interfaces/index.interface";

import {
  getTransactionCategories,
  getTransactionsAction
} from "actions/actionCreator";
import { ReduxStore } from "reducers/interface";
import useFetchData from "customHooks/useFetchData";
import { FETCH_STATES } from "reducers/DataReducer";
import styles from "./styles.module.scss";
import {
  TransactionAnalysisPageProps,
  TransactionsGroupedByCategories,
  CategoryAmount
} from "./interface";

const getCategoryNamesSortedByTotalAmount = (
  transactionsGroupedByCategories: TransactionsGroupedByCategories
) => {
  const categoryTotalAmountObjectArray: CategoryAmount[] = Object.keys(
    transactionsGroupedByCategories
  ).map((category: string) => ({
    category,
    totalAmount: transactionsGroupedByCategories[category].totalAmount
  }));
  categoryTotalAmountObjectArray.sort((a, b) => b.totalAmount - a.totalAmount);
  return categoryTotalAmountObjectArray.map(({ category }) => category);
};

const createTransactionsGroupedByCategories = (
  transactions: Transaction[],
  categories: string[]
) => {
  const transactionsGroupedByCategories: TransactionsGroupedByCategories = {
    "No Category": {
      transactions: [],
      totalAmount: 0
    }
  };

  categories &&
    categories.forEach((category: string) => {
      transactionsGroupedByCategories[category] = {
        transactions: [],
        totalAmount: 0
      };
    });

  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (!category) {
      transactionsGroupedByCategories["No Category"].transactions.push(
        transaction
      );
      transactionsGroupedByCategories["No Category"].totalAmount += amount;
    } else {
      // for now user can add transaction without category
      // reason have not yet made category required
      if (transactionsGroupedByCategories[category]) {
        transactionsGroupedByCategories[category].transactions.push(
          transaction
        );
        transactionsGroupedByCategories[category].totalAmount += amount;
      }
    }
  });

  return transactionsGroupedByCategories;
};

const getDebitTransactions = (transactions: Transaction[]) =>
  transactions.filter(isDebitTypeTransaction);

const TransactionAnalysisPage = ({ userId }: TransactionAnalysisPageProps) => {
  const getTransactionState = useFetchData(
    getTransactionsFromDB,
    GET_TRANSACTIONS_FAILURE_MSG,
    getTransactionsAction,
    userId
  );

  const getTransactionCategoriesState = useFetchData(
    getTransactionCategoriesFromDB,
    GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
    getTransactionCategories,
    userId
  );
  const transactions = useSelector(
    (store: ReduxStore) => store.transactions.transactions
  );
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  let categories: string[];
  // in future will give filters where based on filter applied type will be choose

  const type = DEBIT_TYPE;
  let componentToRender;
  transactions.filter(isDebitTypeTransaction);
  const filteredTransactions = getDebitTransactions(transactions);
  categories =
    type === DEBIT_TYPE
      ? transactionCategories.debit
      : transactionCategories.credit;

  if (filteredTransactions.length === 0) {
    componentToRender = (
      <p className={styles.noData}>!!No Transactions Found!!</p>
    );
  } else {
    const transactionsGroupedByCategories: TransactionsGroupedByCategories =
      createTransactionsGroupedByCategories(filteredTransactions, categories);
    const categoryNamesSortedByTotalAmountDescending =
      getCategoryNamesSortedByTotalAmount(transactionsGroupedByCategories);
    const TransactionAnalysisCards =
      categoryNamesSortedByTotalAmountDescending.map((category) => (
        <motion.li key={category} layout>
          <DayTransactionsCard
            title={category}
            transactions={
              transactionsGroupedByCategories[category].transactions
            }
            totalAmount={transactionsGroupedByCategories[category].totalAmount}
          />
        </motion.li>
      ));
    componentToRender = (
      <ul className={styles.transactionAnalysisPage}>
        {TransactionAnalysisCards}
      </ul>
    );
  }
  return (
    <div className={styles.transactionAnalysisPage}>
      {(getTransactionState.fetching === FETCH_STATES.PENDING ||
        getTransactionCategoriesState.fetching === FETCH_STATES.PENDING) && (
        <LinearProgress />
      )}
      {componentToRender}
    </div>
  );
};

export default TransactionAnalysisPage;
