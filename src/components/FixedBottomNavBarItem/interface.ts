export interface IFixedBottomNavBarItem {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
  isActive?: boolean;
}
