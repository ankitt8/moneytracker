import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
import { ROUTES } from 'Constants';
import { FixedBottomNavBarProps } from './interface';
import AddTransactionModal from 'components/AddTransactionModal';

const FixedBottomNavBar = ({ userId }: FixedBottomNavBarProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.fixedBottomNavBar}>
      <Link to={ROUTES.HOME} className={styles.link}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='home' size='lg' />
          </div>
          <div className={styles.text}>Home</div>
        </div>
      </Link>
      <Link to={ROUTES.SPEND_ANALYSIS} className={styles.link}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='chart-bar' size='lg' />
          </div>
          <div className={styles.text}>Analysis</div>
        </div>
      </Link>
      <Link to={ROUTES.TRANSACTION_CATEGORIES} className={styles.link}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='filter' size='lg' />
          </div>
          <div className={styles.text}>Categories</div>
        </div>
      </Link>
      <div className={styles.link} onClick={() => setOpen(true)}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='plus' size='lg' />
          </div>
          <div className={styles.text}>Add</div>
        </div>
      </div>
      {open && <AddTransactionModal
        userId={userId}
        handleClose={handleClose}
      />}
    </div>
  )
}

export default FixedBottomNavBar;