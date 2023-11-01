import { CREDIT_TYPE, BORROWED_TYPE } from '../../Constants';
import styles from './styles.module.scss';

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
  const filteredTransactions = getFilteredTransactions(transactions, type);
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
  const TransactionAnalysisCards =
    categoryNamesSortedByTotalAmountDescending.map((category) => (
      <TransactionsCardWrapper
        title={category}
        transactions={transactionsGroupedByCategories[category]['transactions']}
        totalAmount={transactionsGroupedByCategories[category]['totalAmount']}
        key={category}
        showDate={showDate}
      />
    ));
  return (
    <ul className={styles.transactionAnalysisPage}>
      {TransactionAnalysisCards}
    </ul>
  );
}
