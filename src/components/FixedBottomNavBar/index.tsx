import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
import { ROUTES } from 'Constants';
import { FixedBottomNavBarProps } from './interface';
import AddTransactionModal from 'components/AddTransactionModal';
import { IFixedBottomNavBarItem } from './interface';

const FixedBottomNavBar = ({ userId }: FixedBottomNavBarProps) => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const handleClose = () => setIsAddTransactionModalOpen(false);
  const history = useHistory();
  const fixedBottomNavBarItemList = [
    {
      text: 'Home',
      icon: <FontAwesomeIcon icon="home" size="lg" />,
      handleClick: () => history.push(ROUTES.HOME)
    },
    {
      text: 'Analysis',
      icon: <FontAwesomeIcon icon="chart-bar" size="lg" />,
      handleClick: () => history.push(ROUTES.SPEND_ANALYSIS)
    },
    {
      text: 'Categories',
      icon: <FontAwesomeIcon icon="filter" size="lg" />,
      handleClick: () => history.push(ROUTES.TRANSACTION_CATEGORIES)
    },
    {
      text: 'Add',
      icon: <FontAwesomeIcon icon="plus" size="lg" />,
      handleClick: () => setIsAddTransactionModalOpen(true)
    }
  ];

  return (
    <div className={styles.fixedBottomNavBar}>
      {fixedBottomNavBarItemList.map((item) => (
        <FixedBottomNavBarItem key={item.text} {...item} />
      ))}
      {isAddTransactionModalOpen && (
        <AddTransactionModal userId={userId} handleClose={handleClose} />
      )}
    </div>
  );
};

const FixedBottomNavBarItem = ({
  icon,
  text,
  handleClick
}: IFixedBottomNavBarItem) => (
  <button onClick={handleClick}>
    <div className={styles.wrapper}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>{text}</div>
    </div>
  </button>
);

export default FixedBottomNavBar;
