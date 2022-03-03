import React from 'react';
import Transactions from 'components/Transactions';
import TransactionSummary from 'components/TransactionSummary';
const HomePage = ({ userId }: { userId: string }) => {
  return (
    <>
      <TransactionSummary />
      <Transactions userId={userId} />
    </>
  );
};

export default HomePage;
