export interface IFixedBottomNavBarItem {
  component: () => JSX.Element;
  handleClick: () => void;
  isActive?: boolean;
}
