import { memo, useState } from 'react';
import TransactionCard from '@moneytracker/common/src/components/TransactionCard';
import { TransactionCardWrapperProps } from './interface';
import styles from './styles.module.scss';
import { getFormattedAmount } from '../../utility';
const areEqual = (prevProps: any, nextProps: any) => {
  if (prevProps.transactions.length !== nextProps.transactions.length)
    return false;
  for (let i = 0; i < prevProps.transactions.length; i += 1) {
    if (prevProps.transactions[i] !== nextProps.transactions[i]) return false;
  }
  return true;
};
const TransactionsCardWrapper = ({
  transactions,
  title,
  totalAmount,
  showDate,
  isNoTransactionsDateVisible,
  isTransactionsCardWrapperExpanded = false
}: TransactionCardWrapperProps): null | JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(
    isTransactionsCardWrapperExpanded
  );
  const transactionsList = transactions.map((transaction) => {
    const { _id: transactionId } = transaction;
    return (
      <li key={transactionId}>
        <TransactionCard transaction={transaction} showDate={showDate} />
      </li>
    );
  });
  if (transactions?.length === 0 && isNoTransactionsDateVisible) return null;
  const getExpandedView = () => {
    if (!isExpanded) return null;
    return transactions.length === 0 ? (
      <p className={styles.noData}>!!No Transactions Found!!</p>
    ) : (
      <ul className={styles.list}>{transactionsList}</ul>
    );
  };
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        className={styles.transactionCardWrapper}
      >
        <p>{title}</p>

        <p className={totalAmount > 0 ? styles.transactionCredit : ''}>
          {getFormattedAmount(totalAmount)}
        </p>
      </button>
      {isExpanded ? getExpandedView() : null}
    </>
  );
};

export default memo(TransactionsCardWrapper, areEqual);
