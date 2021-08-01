export interface FixedBottomNavBarProps {
  userId: string;
}

export interface IFixedBottomNavBarItem {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
}
