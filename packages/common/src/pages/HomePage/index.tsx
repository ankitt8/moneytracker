import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import { ITransactions } from '@moneytracker/common/src/components/Transactions/interface';
import TransactionAnalysisPage from '../TransactionAnalysisPage';
const HomePage = ({
  userId,
  transactions
}: {
  userId: string;
  transactions: ITransactions;
}) => {
  const currentDate = new Date();
  return (
    <>
      <TransactionSummary transactions={transactions} />
      <TransactionAnalysisPage
        transactionsProps={transactions}
        showTransactionsInAscendingOrder={false}
        isNoTransactionsDateVisible={true}
        startDateParam={new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ).toDateString()}
        endDateParam={new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).toDateString()}
      />
    </>
  );
};

export default HomePage;
