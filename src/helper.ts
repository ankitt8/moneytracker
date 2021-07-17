import { TransactionCategories } from 'components/AddTransactionModal/TransactionCategoryInput/interface';
import {
  DEBIT_TYPE,
} from 'Constants';
import { Transaction } from 'interfaces/index.interface';

export function getNoOfDaysCurrentMonth(): number {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  let noOfDays = 0;
  const dateFirstDay = new Date(year, month, 1);
  while (dateFirstDay.getMonth() === month) {
    noOfDays += 1;
    dateFirstDay.setDate(dateFirstDay.getDate() + 1);
  }
  return noOfDays;
}

export const isDebitTypeTransaction = (transaction: Transaction) => {
  // to handle the transactions where type debit or credit is not stored
  // adding undefined match also
  return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}

export const checkTransactionCategoriesChanged = (data: TransactionCategories, storeTransactionCategories: TransactionCategories) => {
  const { credit, debit } = storeTransactionCategories;
  const { credit: dbCredit, debit: dbDebit } = data;
  if (credit.length !== dbCredit.length) return true;
  if (debit.length !== dbDebit.length) return true;
  return false;
}