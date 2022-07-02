import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
import { ROUTES, bottomNavBarText } from 'Constants';
import { FixedBottomNavBarProps } from './interface';
import AddTransactionModal from 'components/AddTransactionModal';
import { IFixedBottomNavBarItem } from './interface';

const FixedBottomNavBar = ({ userId }: FixedBottomNavBarProps) => {
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] =
    useState(false);
  const handleClose = () => setIsAddTransactionModalOpen(false);
  const [activeItem, setActiveItem] = useState<string>(bottomNavBarText.home);
  const history = useHistory();
  const fixedBottomNavBarItemList = [
    {
      text: bottomNavBarText.home,
      icon: <FontAwesomeIcon icon="home" size="lg" />,
      handleClick: () => {
        setActiveItem(bottomNavBarText.home);
        history.push(ROUTES.HOME);
      }
    },
    {
      text: bottomNavBarText.analysis,
      icon: <FontAwesomeIcon icon="chart-bar" size="lg" />,
      handleClick: () => {
        setActiveItem(bottomNavBarText.analysis);
        history.push(ROUTES.SPEND_ANALYSIS);
      }
    },
    {
      text: bottomNavBarText.categories,
      icon: <FontAwesomeIcon icon="filter" size="lg" />,
      handleClick: () => {
        setActiveItem(bottomNavBarText.categories);
        history.push(ROUTES.TRANSACTION_CATEGORIES);
      }
    },
    {
      text: bottomNavBarText.add,
      icon: <FontAwesomeIcon icon="plus" size="lg" />,
      handleClick: () => {
        setIsAddTransactionModalOpen(true);
      }
    }
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
      {isAddTransactionModalOpen && (
        <AddTransactionModal userId={userId} handleClose={handleClose} />
      )}
    </div>
  );
};

const FixedBottomNavBarItem = ({
  icon,
  text,
  handleClick,
  isActive
}: IFixedBottomNavBarItem) => (
  <button
    onClick={handleClick}
    className={`${styles.wrapper} ${isActive && styles.activeItem}`}
  >
    <div className={styles.icon}>{icon}</div>
    <div className={styles.text}>{text}</div>
  </button>
);

export default FixedBottomNavBar;
