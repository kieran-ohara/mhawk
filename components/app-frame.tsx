import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent, useState, KeyboardEvent } from "react";

import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import MenuIcon from "@mui/icons-material/Menu";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import Typography from "@mui/material/Typography";

import InputBase from "@mui/material/InputBase";

import { makeStyles } from "@mui/styles";
import { Theme } from '@mui/material/styles';
import { signOut } from "next-auth/client";
import { useSubscriptions } from "../hooks/subscriptions";
import { usePaymentPlans } from "../hooks/payment-plans";

import CreateSubscriptionDialog from "./create-subscription-dialog";
import {
  default as CreatePaymentPlanDialog,
  CreatePaymentPlanOkResult,
  AmountType,
} from "./create-payment-plan";

import TagsLinks from "./tags-links";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      // backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: "48px",
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function AppFrame(props: any) {
  const { children } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle user-menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleClose = () => {
    signOut();
    setAnchorEl(null);
  };

  // Handle add-menu
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addMenuEl, setAddMenuEl] = useState(null);
  const handleAddMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAddMenuEl(event.currentTarget);
    setAddMenuOpen(true);
  };
  const handleAddMenuClose = () => {
    setAddMenuEl(null);
    setAddMenuOpen(false);
  };

  // Handle new subscription
  const {
    create: createSubscription,
    mutate: mutateSubscriptions,
  } = useSubscriptions();
  const [newSubscriptionOpen, setNewSubscriptionOpen] = useState(false);

  const handleNewSubscriptionClick = () => {
    setAddMenuOpen(false);
    setNewSubscriptionOpen(true);
  };
  const handleNewSubscriptionOk = async (newSubscriptionData: any) => {
    setNewSubscriptionOpen(false);
    await createSubscription(newSubscriptionData);
    mutateSubscriptions();
  };

  const handleNewSubscriptionCancel = () => {
    setNewSubscriptionOpen(false);
  };

  // Handle new payment plan
  const [newPaymentPlanOpen, setNewPaymentPlanOpen] = useState(false);

  const {
    create: createPaymentPlan,
    createWithTotal: createPaymentPlanWithTotal,
    mutate: mutatePaymentPlans,
  } = usePaymentPlans();

  const handleNewPaymentPlanClick = () => {
    setNewPaymentPlanOpen(true);
    setAddMenuOpen(false);
  };

  const handleNewPaymentPlanOk = async (
    paymentPlan: CreatePaymentPlanOkResult
  ) => {
    const { reference, amount, startDate, endDate, amountType } = paymentPlan;

    if (amountType === AmountType.MONTHLY) {
      await createPaymentPlan({
        reference,
        amount,
        startDate,
        endDate,
      });
    } else if (amountType === AmountType.TOTAL) {
      await createPaymentPlanWithTotal({
        reference,
        amount,
        startDate,
        endDate,
      });
    }

    setNewPaymentPlanOpen(false);
    mutatePaymentPlans();
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <Link href="/monthly-outgoings">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <ListSubheader>Outgoings</ListSubheader>
        <Link href="/payment-plans">
          <ListItem button>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Payment Plans" />
          </ListItem>
        </Link>
        <Link href="/subscriptions">
          <ListItem button>
            <ListItemIcon>
              <ReplayIcon />
            </ListItemIcon>
            <ListItemText primary="Subscriptions" />
          </ListItem>
        </Link>
        <ListSubheader>Tags</ListSubheader>
        <TagsLinks />
      </List>
    </div>
  );

  const { window, title } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const router = useRouter();

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`/search?q=${event.currentTarget.value}`);
    }
  };

  return (
    <>
      <div className={classes.root}>
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
            <Typography variant="h6" className={classes.title} noWrap>
              {title}
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onKeyPress={onKeyPress}
              />
            </div>
            <div>
              <IconButton
                aria-label="add new outgoing"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAddMenuClick}
                color="inherit"
              >
                <AddIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={addMenuEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={addMenuOpen}
                onClose={handleAddMenuClose}
              >
                <MenuItem onClick={handleNewPaymentPlanClick}>
                  New Payment Plan&hellip;
                </MenuItem>
                <MenuItem onClick={handleNewSubscriptionClick}>
                  New Subscription&hellip;
                </MenuItem>
              </Menu>

              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Log Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden mdUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={"left"}
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
          <div style={{ height: "calc(100vh - 64px)" }}>{children}</div>
          <CreateSubscriptionDialog
            handleOk={handleNewSubscriptionOk}
            open={newSubscriptionOpen}
            handleCancel={handleNewSubscriptionCancel}
          />
          <CreatePaymentPlanDialog
            open={newPaymentPlanOpen}
            handleOk={handleNewPaymentPlanOk}
            handleCancel={() => setNewPaymentPlanOpen(false)}
          />
        </main>
      </div>
    </>
  );
}

export default AppFrame;
