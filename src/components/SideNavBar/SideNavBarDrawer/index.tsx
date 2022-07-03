import React from 'react';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PaymentIcon from '@material-ui/icons/Payment';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { IDrawerItem } from './interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './style.module.scss';
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));
import { ROUTES } from 'Constants';
import { icons } from 'icons';
function SideNavBarDrawer({ setMobileOpen, username }: ISideNavBarDrawerProps) {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={styles.drawer}>
      <div>
        <div className={classes.toolbar} />
        <div className={styles.flexWrapper}>
          <p className={styles.username}>{`Hi ${username}`}</p>
          <button
            id="installBtn"
            className={styles.installBtn}
            onClick={handleInstallAppClick}
          >
            Install App
          </button>
        </div>
        <Divider />
        <List>
          {drawerItemList.map(({ url, icon, text }) => (
            <DrawerItem
              key={text}
              handleClick={() => {
                history.push(url);
                setMobileOpen(false);
              }}
              icon={icon}
              text={text}
            />
          ))}
        </List>
      </div>
      <div>
        <ListItem button key="logout" onClick={handleLogout}>
          <ListItemIcon>{icons.logout}</ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
}

const drawerItemList = [
  {
    text: 'Home',
    icon: <FontAwesomeIcon icon="home" size="lg" />,
    url: ROUTES.HOME
  },
  {
    text: 'Analysis',
    icon: <FontAwesomeIcon icon="chart-bar" size="lg" />,
    url: ROUTES.SPEND_ANALYSIS
  },
  {
    text: 'Categories',
    icon: <FontAwesomeIcon icon="filter" size="lg" />,
    url: ROUTES.TRANSACTION_CATEGORIES
  },
  {
    text: 'Bank Accounts',
    icon: <AccountBalanceIcon />,
    url: ROUTES.BANK
  },
  {
    text: 'Investments',
    icon: <PaymentIcon />,
    url: ROUTES.INVESTMENT
  },
  {
    text: 'Budget',
    icon: <PaymentIcon />,
    url: ROUTES.BUDGET
  },
  {
    text: 'Food Tracker',
    icon: <FastfoodIcon />,
    url: ROUTES.FOOD_TRACKER
  }
];
const DrawerItem = ({ text, icon, handleClick }: IDrawerItem) => (
  <ListItem button key={text} onClick={handleClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);
const handleInstallAppClick = async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) return;
  promptEvent.prompt();
  const result = await promptEvent.userChoice;
  console.log(result);

  // garbage collect the deferredPrompt added
  window.deferredPrompt = null;
  document.getElementById('installBtn')?.classList.toggle('hidden', true);
};
const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
};
export { SideNavBarDrawer };
