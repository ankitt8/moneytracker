import { CREDIT_TYPE, BORROWED_TYPE } from '../../Constants';
import styles from './styles.module.scss';
import { TransactionsGroupedByCategories } from './interface';
import DayTransactionsCard from '../../components/TransactionCardWrapper';
import {
  createTransactionsGroupedByCategories,
  getCategoryNamesSortedByTotalAmount,
  getFilteredTransactions
} from '../../helper';
import { Transaction } from '../../interfaces';
import { TransactionCategories } from '../../components/AddTransactionModal/TransactionCategoryInput/interface';

interface ITransactionCardsProps {
  transactions: Transaction[];
  transactionCategories: TransactionCategories;
  type: string;
  showDate?: boolean;
}

export function TransactionCards({
  transactions,
  transactionCategories,
  type,
  showDate
}: ITransactionCardsProps) {
  const filteredTransactions = getFilteredTransactions(transactions, type);
  let categories: string[] = transactionCategories.debit;
  if (type === CREDIT_TYPE) categories = transactionCategories.credit;
  if (type === BORROWED_TYPE) categories = transactionCategories.borrowed;

  if (filteredTransactions.length === 0) {
    return <p style={{ fontSize: 12 }}>!!No Transactions Found!!</p>;
  } else {
    const transactionsGroupedByCategories: TransactionsGroupedByCategories =
      createTransactionsGroupedByCategories(filteredTransactions, categories);
    const categoryNamesSortedByTotalAmountDescending =
      getCategoryNamesSortedByTotalAmount(transactionsGroupedByCategories);
    const TransactionAnalysisCards =
      categoryNamesSortedByTotalAmountDescending.map((category) => (
        <DayTransactionsCard
          title={category}
          transactions={
            transactionsGroupedByCategories[category]['transactions']
          }
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
}
