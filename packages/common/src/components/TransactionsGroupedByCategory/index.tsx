import { CREDIT_TYPE } from '../../Constants';

import TransactionsCardWrapper from '../TransactionsCardWrapper';
import {
  createTransactionsGroupedByCategories,
  getCategoryNamesSortedByTotalAmount,
  getFilteredTransactions
} from '../../helper';
import { Transaction } from '../../interfaces';
import { TransactionCategories } from '../AddTransactionModal/TransactionCategoryInput/interface';
type TransactionsGroupedByCategories = Record<
  string,
  {
    transactions: Transaction[];
    totalAmount: number;
  }
>;
interface ITransactionGroupedByCategoryProps {
  transactions: Transaction[];
  transactionCategories: TransactionCategories;
  type?: string;
  showDate?: boolean;
}

export function TransactionsGroupedByCategory({
  transactions,
  transactionCategories,
  type,
  showDate
}: ITransactionGroupedByCategoryProps) {
  let filteredTransactions = transactions;
  if (type) {
    filteredTransactions = getFilteredTransactions(transactions, {
      type: type
    });
  }
  let categories: string[] = transactionCategories.debit;
  if (type === CREDIT_TYPE) categories = transactionCategories.credit;
  if (!type) {
    categories = [
      ...transactionCategories.credit,
      ...transactionCategories.debit,
      ...transactionCategories.borrowed
    ];
  }
  // if (type === BORROWED_TYPE) categories = transactionCategories.borrowed;

  if (filteredTransactions.length === 0) {
    return <p style={{ fontSize: 12 }}>!!No Transactions Found!!</p>;
  }
  const transactionsGroupedByCategories: TransactionsGroupedByCategories =
    createTransactionsGroupedByCategories(filteredTransactions, categories);
  const categoryNamesSortedByTotalAmountDescending =
    getCategoryNamesSortedByTotalAmount(transactionsGroupedByCategories);
  return (
    <>
      {categoryNamesSortedByTotalAmountDescending.map((category) => (
        <TransactionsCardWrapper
          title={category}
          transactions={
            transactionsGroupedByCategories[category]['transactions']
          }
          totalAmount={transactionsGroupedByCategories[category]['totalAmount']}
          key={category}
          showDate={showDate}
        />
      ))}
    </>
  );
}
