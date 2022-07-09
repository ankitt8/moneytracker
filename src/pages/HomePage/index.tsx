import { TransactionsContainer } from 'components/Transactions/TransactionsContainer';
import TransactionSummary from 'components/TransactionSummary';
const HomePage = ({ userId }: { userId: string }) => {
  return (
    <>
      <TransactionSummary />
      <TransactionsContainer userId={userId} />
    </>
  );
};

export default HomePage;
