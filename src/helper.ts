import {
  url,
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

export function getNoOfDaysRemainingCurrentMonth(): number {
  return getNoOfDaysCurrentMonth() - new Date().getDate();
}

export async function getTransactionsFromDB(userId: string): Promise<any> {
  const res = await fetch(url.API_URL_GET_TRANSACTIONS + `/${userId}`)
  return await res.json();
}

export async function getTransactionCategoriesFromDB(userId: string): Promise<any> {
  const res = await fetch(url.API_URL_GET_TRANSACTION_CATEGORIES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "userId": userId })
  })
  return await res.json();
}

export const isDebitTypeTransaction = (transaction: Transaction) => {
  // to handle the transactions where type debit or credit is not stored
  // adding undefined match also
  return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}
