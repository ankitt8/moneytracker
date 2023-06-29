import { TransactionsContainer } from '@moneytracker/common/src/components/Transactions/TransactionsContainer';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
import { ITransactions } from '@moneytracker/common/src/components/Transactions/interface';
const HomePage = ({
  userId,
  transactions
}: {
  userId?: string;
  transactions: ITransactions;
}) => {
  return (
    <>
      <TransactionSummary transactions={transactions} />
      <TransactionsContainer transactions={transactions} userId={userId} />
    </>
  );
};

export default HomePage;
