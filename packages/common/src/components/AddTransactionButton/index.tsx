import React, { useState } from 'react';
import styles from './style.module.scss';
const AddTransactionModal = React.lazy(
  () => import('@moneytracker/common/src/components/AddTransactionModal')
);
import { IAddTransactionButtonProps } from './interface';
function AddTransactionButton({ userId }: IAddTransactionButtonProps) {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const icon = null;
  const handleClick = () => {
    setIsAddTransactionModalOpen(true);
  };
  const handleClose = (e) => {
    e && e.stopPropagation();
    setIsAddTransactionModalOpen(() => false);
  };
  return (
    <div className={styles.addTransactionButtonWrapper}>
      <button onClick={handleClick} className={styles.addTransactionButton}>
        <div className={styles.icon}>{icon}</div>
        {isAddTransactionModalOpen ? (
          <AddTransactionModal userId={userId} handleClose={handleClose} />
        ) : null}
      </button>
    </div>
  );
}

export { AddTransactionButton };
