import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
import { ROUTES, bottomNavBarText } from 'Constants';
// import { FixedBottomNavBarProps } from './interface';
// import AddTransactionModal from 'components/AddTransactionModal';
import { FixedBottomNavBarItem } from 'components/FixedBottomNavBarItem';
import { homeIcon } from './home.js';
import { icons } from 'icons';
const FixedBottomNavBar = () => {
  // const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
  //   useState(false);
  // const handleClose = () => setIsAddTransactionModalOpen(false);
  const [activeItem, setActiveItem] = useState<string>(bottomNavBarText.home);
  const history = useHistory();
  const fixedBottomNavBarItemList = [
    {
      text: bottomNavBarText.home,
      icon: icons.home,
      handleClick: () => {
        setActiveItem(bottomNavBarText.home);
        history.push(ROUTES.HOME);
      }
    },
    {
      text: bottomNavBarText.analysis,
      icon: icons.analysis,
      handleClick: () => {
        setActiveItem(bottomNavBarText.analysis);
        history.push(ROUTES.SPEND_ANALYSIS);
      }
    },
    {
      text: bottomNavBarText.categories,
      icon: icons.filter,
      handleClick: () => {
        setActiveItem(bottomNavBarText.categories);
        history.push(ROUTES.TRANSACTION_CATEGORIES);
      }
    },
    {
      text: bottomNavBarText.other,
      icon: icons.hamburger,
      handleClick: () => {
        /**todo */
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
