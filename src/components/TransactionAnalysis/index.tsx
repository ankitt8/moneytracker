import DayTransactionsCard from 'components/DayTransaction';
import { DEBIT_TYPE } from 'Constants';
import {
  checkDebitTypeTransaction,
  createTransactionsGroupedByCategories,
  sortCategoriesDescByTotalAmount,
  TransactionsGroupedByCategoriesInterface
} from 'helper';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';

const TransactionAnalysisPage = (): ReactElement => {
  // const dispatch = useDispatch();
  // @ts-ignore
  const storeTransactions = useSelector(state => state.transactions.transactions);
  // for now assuming type = 'Debit' filter is selected
  // @ts-ignore
  const transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];
  // const [loader, setLoader] = React.useState(true);
  // const [transactions, setTransactions] = React.useState(storeTransactions);

  // If user directly visits the analysis page then he will not see updated transactions
  // reason the store gets updated when home page is visited
  // so suppose user changes transaction on say laptop and he visits 
  // analysis page on mobile without going to homepage he will not see the refreshed contents
  // If I need to get the transactions for each page then will probably will have to rethink if 
  // storing transactions in redux store is actually required

  // in future will give filters where based on filter applied type will be choose
  const type = DEBIT_TYPE;
  const transactions = storeTransactions.filter(checkDebitTypeTransaction)
  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const transactionsGroupedByCategories: TransactionsGroupedByCategoriesInterface =
    createTransactionsGroupedByCategories(transactions, categories);
  const TransactionAnalysisCards: ReactElement[] = [];

  const categoriesSortedDescTotalAmount = sortCategoriesDescByTotalAmount(transactionsGroupedByCategories);

  categoriesSortedDescTotalAmount.forEach((category) => {
    TransactionAnalysisCards.push(
      <DayTransactionsCard
        key={category}
        title={category}
        transactions={transactionsGroupedByCategories[category]['transactions']}
        totalAmount={transactionsGroupedByCategories[category]['totalAmount']}
      />
    )
  })

  return (
    <ul className={styles.transactionAnalysisPage}>{TransactionAnalysisCards}</ul>
  )
}

export default TransactionAnalysisPage;