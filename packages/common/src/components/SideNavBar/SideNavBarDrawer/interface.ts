export interface IDrawerItem {
  text: string;
  icon: JSX.Element;
  handleClick: () => void;
  username: string;
}

export interface ISideNavBarDrawerProps {
  username: string;
  setMobileOpen: () => void;
}
