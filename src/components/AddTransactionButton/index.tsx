import React, { useState } from 'react';
import styles from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddTransactionModal from 'components/AddTransactionModal';
import { IAddTransactionButtonProps } from './interface';
function AddTransactionButton({ userId }: IAddTransactionButtonProps) {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const icon = <FontAwesomeIcon icon="plus" size="lg" />;
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
        {isAddTransactionModalOpen && (
          <AddTransactionModal userId={userId} handleClose={handleClose} />
        )}
      </button>
    </div>
  );
}

export { AddTransactionButton };
