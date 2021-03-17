import React, { useState, lazy } from 'react';

import { CREDIT_TYPE } from 'Constants';
import cn from 'classnames';
import styles from './styles.module.scss';
import { TransactionCardProps } from './interface';

const EditTransactionModal = lazy(() => import('components/EditTransactionModal'));

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction
}) => {
  const [open, setOpen] = useState(false);
  const { heading, amount } = transaction;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className={cn(styles.transactionCard, {
          [styles.transactionCardCredit]: transaction.type === CREDIT_TYPE
        })}
        onClick={handleClickOpen}
      >
        <p className={styles.title}>{heading}</p>
        <p className={styles.amount}>{amount}</p>
      </div>
      {open && <EditTransactionModal transaction={transaction} handleClose={handleClose} />}
    </>
  );
}

export default TransactionCard;