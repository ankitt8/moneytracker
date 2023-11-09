import {
  BORROWED_TYPE,
  DEBIT_TYPE,
  TRANSACTION_TYPES
} from '@moneytracker/common/src/Constants';
import { Transaction } from './interfaces';
import {
  CategoryAmount,
  TransactionsGroupedByCategories
} from './pages/TransactionAnalysisPage/interface';
import { TRANSACTION_TYPE } from './components/AddTransactionModal/TransactionCategoryInput/interface';

export function getNoOfDaysMonth(
  month = new Date().getMonth(),
  year = new Date().getFullYear()
): number {
  let noOfDays = 0;
  const dateFirstDay = new Date(year, month, 1);
  while (dateFirstDay.getMonth() === month) {
    noOfDays += 1;
    dateFirstDay.setDate(dateFirstDay.getDate() + 1);
  }
  return noOfDays;
}

export function getCurrentMonth() {
  const date = new Date();
  return date.getMonth();
}

export const isDebitTypeTransaction = (transaction: Transaction) => {
  // to handle the transactions where type debit or credit is not stored
  // adding undefined match also
  return transaction.type === DEBIT_TYPE || transaction.type === undefined;
};
export const isBorrowedTypeTransaction = (transaction: Transaction) => {
  // to handle the transactions where type debit or credit is not stored
  // adding undefined match also
  return transaction.type === BORROWED_TYPE;
};

export const isObjectEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};
export const getFilteredTransactions = (
  transactions: Transaction[],
  filters: Record<string, string | string[]>
) => {
  // code is buggy
  // every transaction souuld satisfy all the filters
  if (isObjectEmpty(filters)) return transactions;
  return transactions?.filter((transaction) => {
    // traverse over all the filter
    // and transaction should satisfy all the filter values
    for (const [filterName, filterValue] of Object.entries(filters)) {
      if (Array.isArray(filterValue)) {
        if (!filterValue.includes(transaction[filterName])) return false;
      } else {
        if (transaction[filterName] != filterValue) return false;
      }
    }
    return true;
  });
};

export const createTransactionsGroupedByCategories = (
  transactions: Transaction[],
  categories: string[]
) => {
  const transactionsGroupedByCategories: TransactionsGroupedByCategories = {
    'No Category': {
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
    const { category = 'No Category', amount } = transaction;
    const currTotalAmount =
      transactionsGroupedByCategories[category]?.totalAmount ?? 0;

    // for now user can add transaction without category
    // reason have not yet made category required
    if (transactionsGroupedByCategories[category]) {
      transactionsGroupedByCategories[category]['transactions'].push(
        transaction
      );
      transactionsGroupedByCategories[category].totalAmount =
        getAmountToBeShownTransactionsCardWrapper(currTotalAmount, transaction);
    }
  });

  return transactionsGroupedByCategories;
};

export const getCategoryNamesSortedByTotalAmount = (
  transactionsGroupedByCategories: TransactionsGroupedByCategories
) => {
  const categoryTotalAmountObjectArray: CategoryAmount[] = Object.keys(
    transactionsGroupedByCategories
  ).map((category: string) => ({
    category,
    totalAmount: transactionsGroupedByCategories[category]['totalAmount']
  }));
  categoryTotalAmountObjectArray.sort((a, b) => b.totalAmount - a.totalAmount);
  return categoryTotalAmountObjectArray.map(({ category }) => category);
};

export const getAmountToBeShownTransactionsCardWrapper = (
  totalAmount: number,
  curr: Transaction
) => {
  if (curr.type === TRANSACTION_TYPE.credit) {
    return totalAmount + curr.amount;
  }
  return totalAmount - curr.amount;
};
