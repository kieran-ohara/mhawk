import Link from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import DoneAllIcon from '@material-ui/icons/DoneAll';
import EventIcon from '@material-ui/icons/Event';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import ReplayIcon from '@material-ui/icons/Replay';
import LabelIcon from '@material-ui/icons/Label';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  useTheme,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import pink from '@material-ui/core/colors/pink';

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
    height: '100vh',
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { Component, pageProps } = props;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListSubheader>Live It</ListSubheader>
        <Link href="/monthly-outgoings">
          <ListItem button>
            <ListItemIcon><EventIcon /></ListItemIcon>
            <ListItemText primary="Monthly Outgoings" />
          </ListItem>
        </Link>
        <ListSubheader>Plan It</ListSubheader>
        <Link href="/payment-plans/finite">
          <ListItem button>
            <ListItemIcon><DoneAllIcon /></ListItemIcon>
            <ListItemText primary="Finite Payments" />
          </ListItem>
        </Link>
        <Link href="/payment-plans/recurring">
          <ListItem button>
            <ListItemIcon><ReplayIcon /></ListItemIcon>
            <ListItemText primary="Recurring Payments" />
          </ListItem>
        </Link>
        <ListSubheader>Tags</ListSubheader>
        <Link href="/tag/shared">
          <ListItem button>
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText primary="Shared" />
          </ListItem>
        </Link>
        <Link href="/tag/mortgage">
          <ListItem button>
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText primary="Mortgage" />
          </ListItem>
        </Link>
        <Link href="/tag/cover-bills">
          <ListItem button>
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText primary="Cover Bills" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: pink,
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <CssBaseline />
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
                mhawk
              </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden mdUp implementation="css">
              <Drawer
                container={container}
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
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div style={{ height: 'calc(100vh - 64px)' }}>
              <Component {...pageProps} />
            </div>
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}

export default ResponsiveDrawer;
