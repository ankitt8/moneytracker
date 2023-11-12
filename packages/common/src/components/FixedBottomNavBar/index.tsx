import React, { useState } from 'react';
import styles from './style.module.scss';
import { ROUTES, bottomNavBarText } from '@moneytracker/common/src/Constants';
import { FixedBottomNavBarItem } from '../FixedBottomNavBarItem';
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
      component: <p>{bottomNavBarText.home}</p>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.home);
        router.push(ROUTES.HOME);
      }
    },
    {
      text: bottomNavBarText.analysis,
      component: <p>{bottomNavBarText.analysis}</p>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.analysis);
        router.push(ROUTES.HISTORY);
      }
    },
    {
      text: bottomNavBarText.add,
      component: <AddTransactionButton userId={userId} />,
      handleClick: null
    },
    {
      text: bottomNavBarText.categories,
      component: <p>{bottomNavBarText.categories}</p>,
      handleClick: () => {
        setActiveItem(bottomNavBarText.categories);
        router.push(ROUTES.TRANSACTION_CATEGORIES);
      }
    },
    {
      text: bottomNavBarText.other,
      component: <p>{bottomNavBarText.other}</p>,
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
