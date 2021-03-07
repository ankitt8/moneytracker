import React, { useState } from 'react';
import EditTransactionModal from '../EditTransactionModal';
import { CREDIT_TYPE } from '../../Constants';
import cn from 'classnames';
import styles from './styles.module.scss';
import { TransactionCardProps } from './interface';

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
        <p>{heading}</p>
        <p>{amount}</p>
      </div>
      <EditTransactionModal transaction={transaction} open={open} handleClose={handleClose} />
    </>
  );
}

export default TransactionCard;