import { memo } from 'react';
import TransactionCard from 'components/TransactionCard';
import { TransactionCardWrapperProps } from './interface';
import styles from './styles.module.scss';
const areEqual = (prevProps: any, nextProps: any) => {
  if (prevProps.transactions.length !== nextProps.transactions.length)
    return false;
  for (let i = 0; i < prevProps.transactions.length; i += 1) {
    if (prevProps.transactions[i] !== nextProps.transactions[i]) return false;
  }
  return true;
};
const TransactionCardWrapper = ({
  transactions,
  title,
  totalAmount,
  showDate
}: TransactionCardWrapperProps) => {
  const transactionsList = transactions.map((transaction) => {
    const { _id: transactionId } = transaction;
    return (
      <li key={transactionId}>
        <TransactionCard transaction={transaction} showDate={showDate} />
      </li>
    );
  });

  return (
    <div className={styles.transactionCardWrapper}>
      <div className={styles.transactionCardHeading}>
        <p>{title}</p>
        <p>{totalAmount}</p>
      </div>
      {transactions.length === 0 ? (
        <p className={styles.noData}>!!No Transactions Found!!</p>
      ) : (
        <ul className={styles.list}>{transactionsList}</ul>
      )}
    </div>
  );
};

export default memo(TransactionCardWrapper, areEqual);
