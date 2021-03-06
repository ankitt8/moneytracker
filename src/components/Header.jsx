import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PaymentIcon from '@material-ui/icons/Payment';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledUsername = styled.p`
  font-size: 23px;
`;

// const StyledLogoutButton = styled.button`
//   background-color: red;
//   color: white;
// `;
const StyledDrawerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 30px;
    height: 100vh;
`;
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
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

function Header({ username }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
      localStorage.clear();
      window.location.href = '/';
      // history.push('/');
      // handleDrawerToggle();
  }

  const drawer = (
    <StyledDrawerDiv>
        <div>
      <div className={classes.toolbar} />
        <ListItem button key="username">
            <StyledUsername>{`Hi ${ username }`}</StyledUsername>
        </ListItem>
      <Divider />
      <Link to="/">
        <ListItem button key="home" onClick={handleDrawerToggle}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
        </ListItem>
        </Link>
        <Link to="/transaction-category">
        <ListItem button key="transactionCategory" onClick={handleDrawerToggle}>
            <ListItemIcon><FontAwesomeIcon icon={faFilter} /></ListItemIcon>
            <ListItemText primary="Add Category" />
        </ListItem>
      </Link>
      <Link to="/bankaccounts">
        <ListItem button key="bankaccount" onClick={handleDrawerToggle}>
          <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
          <ListItemText primary="Bank Accounts" />
        </ListItem>
      </Link>
      <Link to="/investments">
        <ListItem button key="investments" onClick={handleDrawerToggle}>
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Investments" />
        </ListItem>
      </Link>
      <Link to="/budget">
        <ListItem button key="budget" onClick={handleDrawerToggle}>
          <ListItemIcon><PaymentIcon /></ListItemIcon>
          <ListItemText primary="Budget" />
        </ListItem>
      </Link>
      <Link to="/food-tracker">
        <ListItem button key="foodtracker" onClick={handleDrawerToggle}>
          <ListItemIcon><FastfoodIcon /></ListItemIcon>
          <ListItemText primary="Food Tracker" />
        </ListItem>
      </Link>
      <Link to="/analysis">
        <ListItem button key="analysis" onClick={handleDrawerToggle}>
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Spend Analysis" />
        </ListItem>
      </Link>
      <Divider />
      {/*<ListItem button key="logout" onClick={handleLogout}>*/}
      {/*  <ListItemIcon><FontAwesomeIcon icon={faSignOutAlt} /></ListItemIcon>*/}
      {/*  <ListItemText primary="Logout" />*/}
      {/*</ListItem>*/}
        </div>
        <div>
            {/*<StyledLogoutButton>*/}
            {/*    <FontAwesomeIcon icon={faSignOutAlt} />Logout*/}
            {/*</StyledLogoutButton>*/}
            <ListItem button key="logout" onClick={handleLogout}>
                <ListItemIcon><FontAwesomeIcon icon={faSignOutAlt} /></ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        </div>
    </StyledDrawerDiv>
  );


  return (
    // <div className={classes.root}>
      <>
      <AppBar position="sticky" className={classes.appBar}>
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
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
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
        <Hidden xsDown implementation="css">
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
      </>
    // </div>
  );
}

Header.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Header;
