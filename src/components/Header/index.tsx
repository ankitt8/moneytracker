import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PaymentIcon from '@material-ui/icons/Payment';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import {IDrawerItem} from './interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useHistory } from 'react-router-dom';
import { HeaderProps } from './interface';

import styles from './styles.module.scss';

import { ROUTES } from 'Constants';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Header = ({
  username,
  children
}: HeaderProps) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((mobileOpen) => !mobileOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    // @ts-ignore
    window.deferredPrompt = e;
    document.getElementById('installBtn')?.classList.toggle('hidden', false);
  })

  const handleInstallAppClick = async () => {
    // @ts-ignore
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    console.log(result);

    // garbage collect the deferredPrompt added 
    // @ts-ignore;
    window.deferredPrompt = null;
    document.getElementById('installBtn')?.classList.toggle('hidden', true);
  }
  const history = useHistory();
  const drawer = (
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
          {
            drawerItemList.map(({url, icon, text}) => (
              <DrawerItem
                key={text}
                handleClick={() => {
                  history.push(url);
                  setMobileOpen(false);
                }}
                icon={icon}
                text={text}
              />)
            )
          }
        </List>
      </div>
      <div>
        <ListItem button key="logout" onClick={handleLogout}>
          <ListItemIcon>
            <FontAwesomeIcon icon='sign-out-alt' />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
  const container = window !== undefined ? () => window.document.body : undefined;
  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Money Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.appBar}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </>
  );
}
const drawerItemList = [
  {
    text: "Home",
    icon: <FontAwesomeIcon icon='home' size='lg' />,
    url: ROUTES.HOME,
  },
  {
    text: "Analysis",
    icon: <FontAwesomeIcon icon='chart-bar' size='lg' />,
    url: ROUTES.SPEND_ANALYSIS
  },
  {
    text: "Categories",
    icon: <FontAwesomeIcon icon='filter' size='lg' />,
    url: ROUTES.TRANSACTION_CATEGORIES
  },
  {
    text: "Bank Accounts",
    icon: <AccountBalanceIcon />,
    url: ROUTES.BANK,
  },
  {
    text: "Investments",
    icon: <PaymentIcon />,
    url: ROUTES.INVESTMENT
  },
  {
    text: "Budget",
    icon: <PaymentIcon />,
    url: ROUTES.BUDGET,
  },
  {
    text: "Food Tracker",
    icon: <FastfoodIcon />,
    url: ROUTES.FOOD_TRACKER
  },

];
const DrawerItem = ({
  text,
  icon,
  handleClick
}: IDrawerItem) => (
  <ListItem button key={text} onClick={handleClick}
  >
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
)

export default Header;
