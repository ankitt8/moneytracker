import { TransactionsContainer } from '@moneytracker/common/src/components/Transactions/TransactionsContainer';
import TransactionSummary from '@moneytracker/common/src/components/TransactionSummary';
const HomePage = ({ userId }: { userId: string }) => {
  return (
    <>
      <TransactionSummary />
      <TransactionsContainer userId={userId} />
    </>
  );
};

export default HomePage;
