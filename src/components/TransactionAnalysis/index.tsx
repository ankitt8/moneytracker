import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import DayTransactionsCard from 'components/DayTransaction';
import { DEBIT_TYPE } from 'Constants';
import {
  checkDebitTypeTransaction,
  createTransactionsGroupedByCategories,
  sortCategoriesDescByTotalAmount,
  TransactionsGroupedByCategoriesInterface
} from 'helper';

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
  let componentToRender;
  if (categories.length === 0) {
    componentToRender = <h2>No Categories Added</h2>;
  } else {
    const transactionsGroupedByCategories: TransactionsGroupedByCategoriesInterface =
      createTransactionsGroupedByCategories(transactions, categories);

    const categoriesSortedDescTotalAmount = sortCategoriesDescByTotalAmount(transactionsGroupedByCategories);

    const TransactionAnalysisCards: ReactElement[] = categoriesSortedDescTotalAmount.map((category) => (
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