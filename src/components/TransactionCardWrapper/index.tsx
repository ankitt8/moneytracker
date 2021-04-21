import React from 'react';
import TransactionCard from 'components/TransactionCard';
import { TransactionCardWrapperProps } from './interface';
import styles from './styles.module.scss';
import { Transaction } from 'interfaces/index.interface';

const TransactionCardWrapper: React.FC<TransactionCardWrapperProps> = ({
  transactions,
  title,
  totalAmount
}) => {
  const transactionsList = transactions.map((transaction: Transaction) => {
    const { _id: transactionId } = transaction;
    return (<li key={transactionId.toString()}>
      <TransactionCard transaction={transaction} />
    </li>)
  })

  return (
    <div className={styles.transactionCardWrapper}>
      <div className={styles.transactionCardHeading}>
        <div>{title}</div>
        <div>{totalAmount}</div>
      </div>
      {transactions.length === 0 ? <p className={styles.noData}>!!No Transactions Found!!</p> :
        <ul className={styles.list}>{transactionsList}</ul>}
    </div>
  )
}

export default TransactionCardWrapper;
