import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
import { ROUTES } from 'Constants';

const FixedBottomNavBar = () => {
  return (
    <div className={styles.fixedBottomNavBar}>
      <Link to={ROUTES.HOME}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='home' size='lg' />
          </div>
          <div className={styles.text}>Home</div>
        </div>
      </Link>
      <Link to={ROUTES.SPEND_ANALYSIS}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='chart-bar' size='lg' />
          </div>
          <div className={styles.text}>Analysis</div>
        </div>
      </Link>
      <Link to={ROUTES.TRANSACTION_CATEGORIES}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon='filter' size='lg' />
          </div>
          <div className={styles.text}>Categories</div>
        </div>
      </Link>
    </div>
  )
}

export default FixedBottomNavBar;