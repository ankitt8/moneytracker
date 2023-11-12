import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { useRouter } from 'next/link';
import { HeaderProps } from './interface';

import { SideNavBar } from '@moneytracker/common/src/components/SideNavBar';

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

const Header = ({ username, children }: HeaderProps) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((mobileOpen) => !mobileOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    window.deferredPrompt = e;
    document.getElementById('installBtn')?.classList.toggle('hidden', false);
  });

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
  const router = useRouter();
  // const drawer = ;
  const container =
    window !== undefined ? () => window.document.body : undefined;
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
      <SideNavBar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        username={username}
      />
      <main className={classes.appBar}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </>
  );
};

export default Header;
