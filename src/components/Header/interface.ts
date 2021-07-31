export interface HeaderProps {
  username: string;
  children: JSX.Element[];
}
export interface IDrawerItem {
  text: string;
  icon: JSX.Element;
  handleClick: () => void;
}
