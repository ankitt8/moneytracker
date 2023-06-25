import React from 'react';
import styles from './style.module.scss';
import { IFixedBottomNavBarItem } from './interface';
const FixedBottomNavBarItem = ({
  component,
  handleClick,
  isActive
}: IFixedBottomNavBarItem) => (
  <div
    onClick={() => {
      handleClick && handleClick();
    }}
    className={`${styles.wrapper} ${isActive ? styles.activeItem : ''}`}
  >
    {component}
    {/* <div className={styles.text}>{text}</div> */}
  </div>
);

export { FixedBottomNavBarItem };
