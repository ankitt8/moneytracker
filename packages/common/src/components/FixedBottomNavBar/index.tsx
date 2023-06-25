import React, { useState } from 'react';
import styles from './style.module.scss';
import { ROUTES, bottomNavBarText } from '@moneytracker/common/src/Constants';
import { FixedBottomNavBarItem } from '../FixedBottomNavBarItem';
import { icons } from '@moneytracker/common/src/icons';
import { AddTransactionButton } from '../AddTransactionButton';
import { useRouter } from 'next/router';
const FixedBottomNavBar = ({ userId }: { userId: string }) => {
  // const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
  //   useState(false);
  // const handleClose = () => setIsAddTransactionModalOpen(false);
  const [activeItem, setActiveItem] = useState<string>(bottomNavBarText.home);
  const router = useRouter();
  const fixedBottomNavBarItemList = [
    {
      text: bottomNavBarText.home,
      component: <div className={styles.icon}>{icons.home}</div>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.home);
        router.push(ROUTES.HOME);
      }
    },
    {
      text: bottomNavBarText.analysis,
      component: <div className={styles.icon}>{icons.analysis}</div>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.analysis);
        router.push(ROUTES.SPEND_ANALYSIS);
      }
    },
    {
      text: bottomNavBarText.add,
      component: <AddTransactionButton userId={userId} />,
      handleClick: null
    },
    {
      text: bottomNavBarText.categories,
      component: <div className={styles.icon}>{icons.filter}</div>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.categories);
        router.push(ROUTES.TRANSACTION_CATEGORIES);
      }
    },
    {
      text: bottomNavBarText.other,
      component: <div className={styles.icon}>{icons.hamburger}</div>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.other);
        router.push(ROUTES.OTHERS);
      }
    }
    // {
    //   text: bottomNavBarText.add,
    //   icon: <FontAwesomeIcon icon="plus" size="lg" />,
    //   handleClick: () => {
    //     setIsAddTransactionModalOpen(true);
    //   }
    // }
  ];

  return (
    <div className={styles.fixedBottomNavBar}>
      {fixedBottomNavBarItemList.map((item) => (
        <FixedBottomNavBarItem
          key={item.text}
          {...item}
          isActive={item.text === activeItem}
        />
      ))}
      {/* {isAddTransactionModalOpen && (
        <AddTransactionModal userId={userId} handleClose={handleClose} />
      )} */}
    </div>
  );
};

export default FixedBottomNavBar;
