import { memo, useState } from 'react';

import {
  CREDIT_TYPE,
  EDIT_TRANSACTION_MODAL_COMPONENT_NAME
} from '@moneytracker/common/src/Constants';
import cn from 'classnames';
import styles from './styles.module.scss';
import { TransactionCardProps } from './interface';
import { getFormattedAmount } from '../../utility';
import AddTransactionModal from '../AddTransactionModal';

// const AddTransactionModal = lazy(
//   () => import('@moneytracker/common/src/components/AddTransactionModal')
// );

const TransactionCard = ({
  transaction,
  showDate = false
}: TransactionCardProps) => {
  const [open, setOpen] = useState(false);
  const { heading, amount } = transaction;
  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
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
            transaction?.bankAccount || transaction?.creditCard || ''
          } ${transaction?.category}`}
        </p>
        <p className={styles.amount}>{getFormattedAmount(amount)}</p>
      </div>
      {open && (
        <AddTransactionModal
          userId={window?.userId}
          transaction={transaction}
          handleClose={handleCloseProps}
          buttonName={'Edit'}
          renderedByComponentName={EDIT_TRANSACTION_MODAL_COMPONENT_NAME}
        />
      )}
    </>
  );
};

export default memo(TransactionCard);
