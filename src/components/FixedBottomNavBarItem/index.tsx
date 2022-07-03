import React from 'react';
import styles from './style.module.scss';
import { IFixedBottomNavBarItem } from './interface';
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

export { FixedBottomNavBarItem };
