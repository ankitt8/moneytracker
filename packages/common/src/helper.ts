import { DEBIT_TYPE } from '@moneytracker/common/src/Constants';
import { Transaction } from 'interfaces/index.interface';
import {
  CategoryAmount,
  TransactionsGroupedByCategories
} from './pages/TransactionAnalysisPage/interface';

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

// TODO use here enum
export const getFilteredTransactions = (
  transactions: Transaction[],
  type?: string
) => {
  if (!type) return transactions;
  return transactions.filter((transaction) => transaction?.type === type);
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
    const { category, amount } = transaction;
    if (!category) {
      transactionsGroupedByCategories['No Category']['transactions'].push(
        transaction
      );
      transactionsGroupedByCategories['No Category'].totalAmount += amount;
    } else {
      // for now user can add transaction without category
      // reason have not yet made category required
      if (transactionsGroupedByCategories[category]) {
        transactionsGroupedByCategories[category]['transactions'].push(
          transaction
        );
        transactionsGroupedByCategories[category].totalAmount += amount;
      }
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
