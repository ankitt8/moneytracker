import { memo, useState, lazy } from 'react';

import { CREDIT_TYPE } from 'Constants';
import cn from 'classnames';
import styles from './styles.module.scss';
import { TransactionCardProps } from './interface';

const EditTransactionModal = lazy(
  () => import('components/EditTransactionModal')
);

const TransactionCard = ({
  transaction,
  showDate = false
}: TransactionCardProps) => {
  const [open, setOpen] = useState(false);
  const { heading, amount } = transaction;
  const handleClickOpen = () => setOpen(true);
  const handleCloseProps = () => setOpen(false);
  let date = '';
  if (showDate) {
    date += `${new Date(transaction.date).getDate()}`;
    date += '/';
    date += `${new Date(transaction.date).getMonth() + 1}`;
    date += '/';
    date += `${new Date(transaction.date).getFullYear()}`;
    date += ' ';
  }
  return (
    <>
      <div
        className={cn(styles.transactionCard, {
          [styles.transactionCardCredit]: transaction.type === CREDIT_TYPE
        })}
        onClick={handleClickOpen}
      >
        <p className={styles.title}>
          {`${date} ${heading} ${
            transaction.bankAccount ?? transaction.creditCard ?? ''
          }`}
        </p>
        <p className={styles.amount}>{amount}</p>
      </div>
      {open && (
        <EditTransactionModal
          transaction={transaction}
          handleCloseProps={handleCloseProps}
        />
      )}
    </>
  );
};

export default memo(TransactionCard);
