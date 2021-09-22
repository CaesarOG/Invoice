import React from 'react';    import { connect, MapStateToProps } from 'react-redux'
import { createPropsGetter, User } from '../actions/services/models';    import { ActionType } from 'typesafe-actions';     import { RootState } from 'MyTypes'
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, ListItem,
  withStyles, WithStyles, Theme, createStyles, Divider, ListItemIcon, ListItemText, Drawer, List, Omit, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Button, Snackbar, Slide } from '@material-ui/core'
import MySnackbarContent from './MySnackbarContent'
import { Menu as MenuI, Person as AccountIcon, Search as SearchIcon, ArrowBack, ThumbUp as ThumbUpIcon,
  ShoppingCart as ShoppingCartIcon, LocalOffer as TicketIcon, BusinessCenter as DeliveredIcon,
  SmsFailed as FeedbackIcon, DiscFull as DiscIcon, Email as MessageIcon, Report as ReportIcon,
  Error as DefenceIcon, AccountBox as CustomerIcon, Done as ShippedIcon, Publish as UploadIcon, NotificationImportant
} from '@material-ui/icons';    import { Link, LinkProps } from 'react-router-dom'; import services from '../actions/services'; import * as H from 'history';
import { fade } from '@material-ui/core/styles/colorManipulator';    import { Typography } from './WidgetAndWrappers'
import classnames from 'classnames';    import tinycolor from 'tinycolor2';    import { Variant } from '@material-ui/core/styles/createTypography';
import { HeaderAction, SideBarAction } from '../actions';import { HeaderState, SideBarState, hDinitialState, sBinitialState } from '../reducers/HeaderSideReducer'

const avStyles = (theme: Theme) => createStyles({
  avatar: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%"
  },
  text: {
    color: 'white',
  }
});

type avProps = { color: "error" | "primary" | "secondary", theme: Theme, name: string } & WithStyles<typeof avStyles>;

const usrAv: React.FC<avProps> = ({ classes, theme, color = "primary", name }: avProps) => {
  const letters = name.split(" ")
    .map(word => word[0])
    .join("");

  return (
    <div className={classes.avatar} style={{ backgroundColor: theme.palette[color].main }}>
      <Typography className={classes.text}>{letters}</Typography>
    </div>
  );
}
const UserAvatar = withStyles(avStyles, { withTheme: true })(usrAv)


const typesIcons: { [key: string]: JSX.Element } = {
  "e-commerce": <ShoppingCartIcon />,
  offer: <TicketIcon />,
  info: <ThumbUpIcon />,
  message: <MessageIcon />,
  feedback: <FeedbackIcon />,
  customer: <CustomerIcon />,
  shipped: <ShippedIcon />,
  delivered: <DeliveredIcon />,
  defence: <DefenceIcon />,
  report: <ReportIcon />,
  upload: <UploadIcon />,
  disc: <DiscIcon />,
};

const getIconByType = (type = "offer") => typesIcons[type];

type ntProps = Partial<{
  extraButton: boolean, extraButtonClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, theme: Theme,
  variant: 'contained' | "rounded", typographyVariant: Variant, className: string,
  color: "primary" | "secondary" | "error", type: string, shadowless: boolean
} & WithStyles<typeof ntStyles>>;

const ntStyles = (theme: Theme) => createStyles({
  notificationContainer: {
    display: "flex",
    alignItems: "center"
  },
  notificationContained: {
    borderRadius: 45,
    height: 45,
    boxShadow: "0px 3px 18px 0px rgba(69,88,163,0.7),0px 3px 3px -2px rgba(178,178,178,0.1),0px 1px 8px 0px rgba(154,154,154,0.1)" //widgetDark
  },
  notificationContainedShadowless: {
    boxShadow: 'none',
  },
  notificationIcon: {

  },
  notificationIconContainer: {
    minWidth: 45,
    height: 45,
    borderRadius: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },
  notificationIconContainerContained: {
    fontSize: 18,
    color: '#FFFFFF80',
  },
  notificationIconContainerRounded: {
    marginRight: theme.spacing(2),
  },
  containedTypography: {
    color: "white"
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  extraButton: {
    color: 'white',
    '&:hover, &:focus': {
      background: 'transparent',
    }
  },
});

const notif: React.FC<ntProps> = ({ classes, theme, variant, ...props }: ntProps) => {
  if(Boolean(props.type) !== true) {
    props.type = "notification"
  }
  const icon = getIconByType(props.type)
  if(Boolean(props.color) !== true) {
    props.color = "secondary"
  }
  const iconWithStyles = React.cloneElement(icon, {
    classes: {
      root: classes!.notificationIcon
    },
    style: {
      color: variant !== "contained" && theme!.palette[props!.color!] && theme!.palette[props!.color!].main
    }
  });
  
  return (
    <div className={classnames(classes!.notificationIconContainer, {
      [classes!.notificationContained]: variant === "contained",
      [classes!.notificationContainedShadowless]: props.shadowless
    })}
      style={{
        backgroundColor:
          (variant === "contained" && theme!.palette[props!.color!]) ? theme!.palette[props!.color!].main : undefined
      }}
    >
      <div className={classnames(classes!.notificationIconContainer, {
        [classes!.notificationIconContainerContained]: variant === "contained",
        [classes!.notificationIconContainerRounded]: variant === "rounded"
      })}
        style={{
          backgroundColor:
            (variant === "rounded" && theme!.palette[props!.color!]) ? tinycolor(theme!.palette[props!.color!].main).setAlpha(0.15).toRgbString() : undefined
        }}
      >  {iconWithStyles}
      </div>
      <div className={classes!.messageContainer}>
        <Typography className={classnames({
          [classes!.containedTypography]: variant === "contained"
        })}
          variant={props.typographyVariant} size={(variant !== "contained" && !props.typographyVariant) ? "md" : undefined}
        >

        </Typography>
      </div>
    </div>
  );
}

const Notification = withStyles(ntStyles, { withTheme: true })(notif)


// const messages: Array<{ id: number, variant: "error" | "primary" | "secondary", name: string, message: string, time: string }> = [
//   {
//     id: 0,
//     variant: "error",
//     name: "Jane Hew",
//     message: "Hey! How is it going?",
//     time: "9:32"
//   },
//   {
//     id: 1,
//     variant: "primary",
//     name: "Lloyd Brown",
//     message: "Check out my new Dashboard",
//     time: "9:18"
//   },
//   {
//     id: 2,
//     variant: "primary",
//     name: "Mark Winstein",
//     message: "I want rearrange the appointment",
//     time: "9:15"
//   },
//   {
//     id: 3,
//     variant: "secondary",
//     name: "Liana Dutti",
//     message: "Good news from sale department",
//     time: "9:09"
//   }
// ];


const mapStateToPropsH: MapStateToProps<HeaderState, {}, RootState> = (state: RootState) => ({
  isSearchOpen: state.HeaderReducer.isSearchOpen,
  isMailsUnread: state.HeaderReducer.isMailsUnread,
  isNotificationsUnread: state.HeaderReducer.isNotificationsUnread,
  signedIn: state.HeaderReducer.signedIn,
  notificationsMenu: state.HeaderReducer.notificationsMenu,
  profileMenu: state.HeaderReducer.profileMenu,
  user: state.HeaderReducer.user,
  ntfnModalOpen: state.HeaderReducer.ntfnModalOpen,
  error: state.HeaderReducer.error,
  errOpen: state.HeaderReducer.errOpen,
  notifications: state.HeaderReducer.notifications,
  dues: state.HeaderReducer.dues
})

type HeaderAction = ActionType<typeof HeaderAction>;

const mapDispatchToPropsH = {
  openNotifsMenu: HeaderAction.openNotifsMenu,
  closeNotificationsMenu: HeaderAction.closeNotificationsMenu,
  openProfileMenu: HeaderAction.openProfileMenu,
  closeProfileMenu: HeaderAction.closeProfileMenu,
  toggleSearch: HeaderAction.toggleSearch,
  logout: HeaderAction.logout,
  setUserSigned: HeaderAction.setUserSigned,
  handleChangeSingleSel: HeaderAction.handleChangeSingleSel,
  goHome: HeaderAction.goHome,
  closeDialog: HeaderAction.closeDialog,
  handleCloseErr: HeaderAction.handleCloseErr,
  goInvoiceNtfn: HeaderAction.goInvoice
}

type StatePropsH = ReturnType<typeof mapStateToPropsH>
type DispatchPropsH = typeof mapDispatchToPropsH
type OwnPropsH = { theme: Theme, isSidebarOpened: boolean, toggleSidebar: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any };
type PropsH = Partial<StatePropsH & DispatchPropsH & OwnPropsH> & WithStyles<typeof hdStyles>;
const getPropsH = createPropsGetter(Object.assign({}, hDinitialState, mapDispatchToPropsH))

class Header extends React.Component<PropsH, {}> {
  componentDidMount() {
    let user: User = services.localStorage.loadItem<User>("user")
    if (user && user.firstName && user.firstName !== "") {
      this.props.setUserSigned!(user)
    }
  }

  render() { //openProfileMenu
    const { isSidebarOpened, isSearchOpen, notificationsMenu, toggleSidebar, signedIn, user,
      openProfileMenu, logout, classes, toggleSearch, openNotifsMenu, closeNotificationsMenu,
      profileMenu, goHome, closeDialog, closeProfileMenu,
      error, errOpen, handleCloseErr, notifications, goInvoiceNtfn, dues } = getPropsH(this.props)
    return (
      <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton color="inherit" onClick={toggleSidebar}
            className={classnames(classes.headerMenuButton, classes.headerMenuButtonCollapse)}
          >
            {isSidebarOpened ? (
              <ArrowBack classes={{ root: classnames(classes.headerIcon, classes.headerIconCollapse) }} />
            ) : (
                <MenuI classes={{ root: classnames(classes.headerIcon, classes.headerIconCollapse) }} />
              )}
          </IconButton>
          <Typography variant="h6" weight="medium" color="primary" className={classnames(classes.grow, classes.logotype)} > startupXchange </Typography>
          <div className={classnames(classes.search, { [classes.searchFocused]: isSearchOpen })} >
            <div className={classnames(classes.searchIcon, { [classes.searchIconOpened]: isSearchOpen })}
              onClick={toggleSearch}
            >
              <SearchIcon classes={{ root: classes.headerIcon }} />
            </div>
            <InputBase placeholder="Search..." classes={{ root: classes.inputRoot, input: classes.inputInput }} />
          </div>
          {/* <IconButton color="inherit" aria-haspopup="true" aria-controls="mail-menu"
            onClick={openMailMenu} className={classes.headerMenuButton} disabled={signedIn}
          >
            <Badge badgeContent={isMailsUnread ? messages.length : null} color="secondary">
              <MailIcon classes={{ root: classes.headerIcon }} />
            </Badge>
          </IconButton>
          */}
          <IconButton color="inherit" aria-haspopup="true" aria-controls="profile-menu"
            onClick={openProfileMenu} className={classes.headerMenuButton} disabled={!signedIn}
          >
            <AccountIcon classes={{ root: classes.headerIcon }} />
          </IconButton>
          {signedIn && <React.Fragment>

          <IconButton color="inherit" aria-haspopup="true" aria-controls="notifications-menu"
            onClick={openNotifsMenu} className={classes.headerMenuButton} disabled={!signedIn}
          >
            <NotificationImportant classes={{ root: classes.headerIcon }} />
          </IconButton>
          <Menu id="notifications-menu" open={Boolean(notificationsMenu)} anchorEl={notificationsMenu}
            onClose={closeNotificationsMenu} className={classes.headerMenu} disableAutoFocusItem >
              {notifications!.map(notification =>
                <MenuItem key={notification.message+"r"} onClick={(e) => {goInvoiceNtfn(e, notification)}} className={classes.headerMenuItem} >
                  <Notification {...notification} typographyVariant="caption" />
                </MenuItem>
              )}
          </Menu>

          <Menu id="profile-menu" open={Boolean(profileMenu)} anchorEl={profileMenu} onClose={closeProfileMenu}
            className={classes.headerMenu} classes={{ paper: classes.profileMenu }} disableAutoFocus >
            <div className={classes.profileMenuUser} >
              <UserAvatar name={user.firstName + " " + user.lastName} color="primary"></UserAvatar>
              <Typography variant="h4" weight="medium"> {user.firstName + " " + user.lastName} </Typography>
              <Typography className={classes.profileMenuLink} variant="button" color="primary">Invoices</Typography>
            </div>
            <MenuItem className={classnames(classes.profileMenuItem, classes.headerMenuItem)} onClick={goHome} >
              <AccountIcon className={classes.profileMenuIcon} /> {user.role!}
            </MenuItem>
            <MenuItem className={classnames(classes.profileMenuItem, classes.headerMenuItem)}>
              Notifications
            </MenuItem>
            <div className={classes.profileMenuUser} onClick={logout}>
              <Typography className={classes.profileMenuLink} color="primary">Sign Out</Typography>
            </div>
          </Menu>

          </React.Fragment>}
        </Toolbar>
      </AppBar>
      <Dialog open={dues}>
        <DialogTitle id="form-dialog-title">Overdue Invoices</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have {notifications?.length} overdue invoices.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ (e) => { closeDialog(e) }} color="primary">OK</Button>
          <Button onClick={undefined} color="primary">Later</Button>
          </DialogActions>
      </Dialog>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errOpen} autoHideDuration={6000} onClose={handleCloseErr} 
          TransitionComponent={TransitionRight}
        >
          <MySnackbarContent variant="error" message={error} className={classes.margin} onClose={handleCloseErr} />
        </Snackbar>
      </React.Fragment>
    )
  }
}


const hdStyles = (theme: Theme) => createStyles({
  logotype: {
    color: "white",
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
    fontWeight: 500,
    fontSize: 18,
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  appBar: {
    width: "100vw",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  margin: {
    margin: theme.spacing(1)
  }, 
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  grow: {
    flexGrow: 1
  },
  inpWidth: {
    width: '100%',
    flexGrow: 1,
    boxSizing: 'border-box'
  },
  search: {
    position: "relative",
    borderRadius: 25,
    paddingLeft: theme.spacing(2.5),
    width: 36,
    backgroundColor: fade(theme.palette.common.black, 0),
    transition: theme.transitions.create(["background-color", "width"]),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: fade(theme.palette.common.black, 0.08)
    }
  },
  searchFocused: {
    backgroundColor: fade(theme.palette.common.black, 0.08),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 250
    }
  },
  searchIcon: {
    width: 36,
    right: 0,
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: theme.transitions.create("right"),
    "&:hover": {
      cursor: "pointer"
    }
  },
  searchIconOpened: {
    right: theme.spacing(1.25)
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    height: 36,
    padding: 0,
    paddingRight: 36 + theme.spacing(1.25),
    width: "100%"
  },
  messageContent: {
    display: "flex",
    flexDirection: "column"
  },
  headerMenu: {
    marginTop: theme.spacing(7)
  },
  headerMenuList: {
    display: "flex",
    flexDirection: "column"
  },
  headerMenuItem: {
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white"
    }
  },
  headerMenuButton: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1 / 2)
  },
  headerMenuButtonCollapse: {
    marginRight: theme.spacing(2)
  },
  headerIcon: {
    fontSize: 28,
    color: "rgba(255, 255, 255, 0.35)"
  },
  headerIconCollapse: {
    color: "white"
  },
  profileMenu: {
    minWidth: 265
  },
  profileMenuUser: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2)
  },
  profileMenuItem: {
    color: theme.palette.text.hint
  },
  profileMenuIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.hint
  },
  profileMenuLink: {
    fontSize: 16,
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer"
    }
  },
  messageNotification: {
    height: "auto",
    display: "flex",
    alignItems: "center",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.paper
    }
  },
  messageNotificationSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: theme.spacing(2)
  },
  messageNotificationBodySide: {
    alignItems: "flex-start",
    marginRight: 0
  },
  sendMessageButton: {
    margin: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textTransform: "none"
  },
  sendButtonIcon: {
    marginLeft: theme.spacing(2)
  },
  StripeElement: {
    height: 40,
    padding: "10 12",
    width: "100%",
    color: "#32325d",
    backgroundColor: "white",
    border: "1 px solid transparent",
    borderRadius: "4px",
    boxShadow: "0 1px 3px 0 #e6ebf1",
    webkitTransition: "box-shadow 150ms ease",
    transition: "box-shadow 150ms ease",
    "&:focus": {
      boxShadow: "0 1px 3px 0 #cfd7df"
    },
    "&:invalid": {
      borderColor: "#fa755a"
    },
    "&:webkit-autofill": {
      backgroundColor: "#fefde5 !important"
    }
  }

});

function TransitionRight(props: any) {
  return <Slide {...props} direction="right" />;
}

const stylesHeader = withStyles(hdStyles, { withTheme: true })(Header)

//Connected Component
const connectedHeader = connect<StatePropsH, DispatchPropsH, {}, RootState>(
  mapStateToPropsH,
  mapDispatchToPropsH
)(stylesHeader);

export { connectedHeader as Header }



const dotStyles = (theme: Theme) => createStyles({
  dotBase: {
    width: 5,
    height: 5,
    backgroundColor: theme.palette.text.hint,
    borderRadius: "50%",
    transition: theme.transitions.create("background-color")
  },
  dotLarge: {
    width: 8,
    height: 8
  },
  dotSmall: { width: 3, height: 3 }
})

type dtProps = Partial<{ size: 'large' | 'small', color: 'primary' | 'secondary' | 'error', theme: Theme }> & WithStyles<typeof dotStyles>

const dot: React.FC<dtProps> = ({ classes, size, color, theme }: dtProps) => (
  <div
    className={classnames(classes.dotBase, { [classes.dotLarge]: size === "large", [classes.dotSmall]: size === "small" })}
    style={{ backgroundColor: color && theme!.palette[color] && theme!.palette[color].main }}
  />
)

export const Dot = withStyles(dotStyles, { withTheme: true })(dot)



const lnStyles = (theme: Theme) => createStyles({
  link: {
    textDecoration: "none",
    paddingLeft: theme.spacing(4.5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.paper
    }
  },
  linkNested: {
    paddingLeft: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover, &:focus": {
      backgroundColor: "#FFFFFF"
    }
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + "99",
    transition: theme.transitions.create("color"),
    width: 24,
    display: "flex",
    justifyContent: "center"
  },
  linkIconActive: {
    color: theme.palette.primary.main
  },
  linkText: {
    padding: 0,
    color: theme.palette.text.secondary + "CC",
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 16
  },
  linkTextActive: {
    color: theme.palette.text.primary
  },
  linkTextHidden: {
    opacity: 0
  },
  nestedList: {
    paddingLeft: theme.spacing(4.5) + 40
  },
  sectionTitle: {
    marginLeft: theme.spacing(4.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  linkActive: {
    backgroundColor: theme.palette.background.paper
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    height: 1,
    backgroundColor: "#D8D8D880"
  }
})

type lnProps = { to?: string, /*icon: SvgIconComponent,*/ label?: string, type?: string,
  isSidebarOpened: boolean, color?: "primary" | "secondary" | "error" } & WithStyles<typeof lnStyles>;

const toMaker = (to: string, loc: H.Location<H.LocationState>): H.LocationDescriptor<H.LocationState> => {
  return {pathname: to, state: {from: loc.pathname}}
}

const SbLn: React.FC<lnProps> = ({ label, classes, type, isSidebarOpened, color, to }: lnProps) => {
  const isLinkActive = to && (window.location.href === to || window.location.href.indexOf(to) !== -1)
  const RenderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={(loc) => {return toMaker(to!, loc)}} ref={ref} {...itemProps} />
      )),
    [to],
  ); // CRAZY!! https://dev.to/ranewallin/js-bites-react-hook-is-called-in-a-function-which-is-neither-a-react-function-or-sic-a-custom-react-hook-1g2c

  if (type === "title") {
    return ( // Isn't this obnoxiously long? Always use less lines as possible, but not past column 140.
      <Typography
        className={classnames(classes.linkText, classes.sectionTitle, {
          [classes.linkTextHidden]: !isSidebarOpened
        })}
      >
        {label}
      </Typography>
    )
  }

  if (type === "divider") return <Divider className={classes.divider} />;

  return (
    <ListItem button className={classes.link} component={RenderLink}
      classes={{   root: classnames( classes.link, { [classes.linkActive] : isLinkActive } )   }}
      disableRipple
    >
      <ListItemIcon className={classnames( classes.linkIcon, {[classes.linkIconActive]: isLinkActive} ) }>
        <Dot color={color} size="large" />
      </ListItemIcon>
      <ListItemText primary={label}
        classes={{   primary: classnames( classes.linkText, { 
          [classes.linkTextActive]: isLinkActive, [classes.linkTextHidden]: !isSidebarOpened } )   }}
      />
    </ListItem>
  );
}

const SideBarLink = withStyles(lnStyles, {withTheme: true})(SbLn)


const mapStateToPropsS: MapStateToProps<SideBarState, {}, RootState> = (state: RootState) => ({
  isPermanent: state.SideBarReducer.isPermanent
})

type SideBarAction = ActionType<typeof SideBarAction>;

const mapDispatchToPropsS = {
  windowWidthChange: SideBarAction.handleWindowWidthChange
}

type StatePropsS = ReturnType<typeof mapStateToPropsS>
type DispatchPropsS = typeof mapDispatchToPropsS
type OwnPropsS = {theme: Theme, isSidebarOpened: boolean, toggleSidebar: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any };
type PropsS = Partial<StatePropsS & DispatchPropsS & OwnPropsS> & WithStyles<typeof sbStyles>;
const getPropsS = createPropsGetter(Object.assign({}, sBinitialState, mapDispatchToPropsS))

class SideBar extends React.Component<PropsS, {}> {

  componentDidMount() {
    window.addEventListener('resize', (e) => this.props.windowWidthChange!(this.props.isPermanent!, this.props.theme!))
    //this.props.windowWidthChange!(this.props.isPermanent!, this.props.theme!)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', (e) => this.props.windowWidthChange!(this.props.isPermanent!, this.props.theme!))
  }

  structure = [
    {id: 0, type: 'title', label: 'All Invoices'},
    {id: 1, type: 'divider'},
    {id: 0, label: 'Invoices', link: '/', color: 'primary' as 'primary'|'secondary'|'error'},
  ];

  render() { //theme
    const { classes, toggleSidebar, isSidebarOpened, isPermanent } = getPropsS(this.props)
    return (
      <Drawer variant={isPermanent ? 'permanent' : 'temporary'} open={isSidebarOpened}
        className={classnames(classes.drawer, {
          [classes.drawerOpen]: isSidebarOpened, [classes.drawerClose]: !isSidebarOpened
        })}
        classes={{  paper: classnames({ [classes.drawerOpen]: isSidebarOpened, [classes.drawerClose]: !isSidebarOpened })  }}
      >
        <div className={classes.toolbar} />
        <div className={classes.mobileBackButton}>
          <IconButton onClick={toggleSidebar}>
            <ArrowBack classes={{ root: classnames(classes.menuButton) }} />
          </IconButton>
        </div>
        <List className={classes.sidebarList}>
          {this.structure.map((link,ix) => (
            <SideBarLink key={link.label!+`${ix}`} isSidebarOpened={isSidebarOpened!} color={link.color!} type={link.type!} 
              label={link.label!} to={link.link!} />) 
            ) 
          }
        </List>
      </Drawer>
    )
  }
}

const drawerWidth = 240;

const sbStyles = (theme: Theme) => createStyles({
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 40,
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
    }
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("sm")]: {
      display: 'none',
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sidebarList: {
    marginTop: theme.spacing(6),
  },
  mobileBackButton: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(3),
    [theme.breakpoints.only("sm")]: {
      marginTop: theme.spacing(0.625),
    },
    [theme.breakpoints.up("md")]: {
      display: 'none',
    }
  }
})

const stylesSideBar = withStyles(sbStyles, { withTheme: true })(SideBar)

//Connected Component
const connectedSideBar = connect<StatePropsS, DispatchPropsS, {}, RootState>(
  mapStateToPropsS,
  mapDispatchToPropsS
)(stylesSideBar);

export { connectedSideBar as SideBar }