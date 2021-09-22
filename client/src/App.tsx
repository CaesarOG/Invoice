import * as React from 'react';
import tinycolor from 'tinycolor2'
import { Router, Switch } from 'react-router-dom'
// import { hot } from 'react-hot-loader'
import { Helmet } from 'react-helmet'
import { createBrowserHistory } from 'history'
import { MuiThemeProvider, createMuiTheme, createStyles, withStyles, Theme, WithStyles } from '@material-ui/core/styles'
import { SignIn, SignUp, PrivateRoute, ForwardRoute, Header, PrivateHome, SideBar } from './components'
import './App.css'
import classnames from 'classnames'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { RootState } from 'MyTypes'
import { AppState } from './reducers/HeaderSideReducer'
import { AppAction } from './actions'
import { indigo, pink, orange } from '@material-ui/core/colors';
import { CssBaseline } from '@material-ui/core';
import { InvoiceDet } from './components/InvoiceDet';
import { EditInvoice } from './components/EditInvoice';

export const history = createBrowserHistory()
// type Props = RouteComponentProps<any>;

const lightenRate = 7.5, darkenRate = 15;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: tinycolor(indigo[500]).toHexString(),
      light: tinycolor(indigo[500]).lighten(lightenRate).toHexString(),
      dark: tinycolor(indigo[500]).darken(darkenRate).toHexString()
    },
    secondary: {
      main: tinycolor(pink[500]).toHexString(),
      light: tinycolor(pink[500]).lighten(lightenRate).toHexString(),
      dark: tinycolor(pink[500]).darken(darkenRate).toHexString(),
      contrastText: "#FFFFFF"
    },
    error: {
      main: tinycolor(orange[500]).toHexString(),
      light: tinycolor(orange[500]).lighten(lightenRate).toHexString(),
      dark: tinycolor(orange[500]).darken(darkenRate).toHexString()
    },
    text: {
      primary: "#4A4A4A",
      secondary: "#6E6E6E",
      hint: "#B9B9B9"
    },
    background: {
      default: "#F6F7FF",
      paper: "#F3F5FF"
    },
  },
  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: "#4A4A4A1A"
      }
    },
    MuiMenu: {
      paper: {
        boxShadow:
          "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A"
      }
    },
    MuiSelect: {
      icon: {
        color: "#B9B9B9",
      }
    },
    MuiListItem: {
      "root": {
        "&$button": {
          '&:hover, &:focus': {
            backgroundColor: '#F3F5FF',
          },
        },
        "&$selected": {
          backgroundColor: '#F3F5FF !important',
          '&:focus': {
            backgroundColor: '#F3F5FF',
          },
        }
      },

    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "white"
      }
    },
    MuiTableRow: {
      root: {
        height: 56,
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: '1px solid rgba(224, 224, 224, .5)',
      },
      head: {
        fontSize: '0.95rem',
      },
      body: {
        fontSize: '0.95rem',
      }
    }
  }
});

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps
type Props = StateProps & DispatchProps & WithStyles<typeof styles>;

class App extends React.Component<Props, {}> {

/*
https://tylermcginnis.com/react-router-cannot-get-url-refresh/
https://tylermcginnis.com/react-router-protected-routes-authentication/
https://reacttraining.com/blog/react-router-v5-1/, https://blog.logrocket.com/conquer-navigation-state-with-react-router-and-redux-f1beb9b8ea7c/
https://stackoverflow.com/questions/44121069/how-to-pass-params-with-history-push-link-redirect-in-react-router-v4
*/
//onClick={() => this.props.history.push(`/register`)}+
//<BrowserRouter history={history}>
  render() {
    const { classes, isSidebarOpened, toggleSidebar } = this.props 
    return (
      <div className={classes.root}>
        <Helmet><title> Invoices </title></Helmet>
        <Router history={history}>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Header isSidebarOpened={isSidebarOpened} toggleSidebar={toggleSidebar} />
          <SideBar isSidebarOpened={isSidebarOpened} toggleSidebar={toggleSidebar} />
          <div className={classnames(classes.content, { [classes.contentShift]: isSidebarOpened })}>
            <div className={classes.fakeToolbar} />
            <Switch>
              <PrivateHome exact path="/" />
              <PrivateRoute exact path='/detail/:id' comp={InvoiceDet} />
              <PrivateRoute exact path='/editcr8' comp={EditInvoice} />
              <ForwardRoute exact path="/signin" SignIn={SignIn} /> 
              <ForwardRoute exact path="/signup" SignUp={SignUp} />
            </Switch>
          </div> 
        </MuiThemeProvider>
        </Router>
      </div>
    )
  }

}


//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<AppState, {}, RootState> = (state: RootState) => ({
  ...(state.AppReducer)
});

//Map Redux Actions to component props
const mapDispatchToProps = {
  toggleSidebar: AppAction.toggleSidebar
}

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    display: 'flex', 
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  content: {
    flexgrow: 1,
    padding: theme.spacing(3),
    width: `calc(100vw - 240px)`,
    minHeight: '100vh'
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(1)*6}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fakeToolbar: {
    ...theme.mixins.toolbar
  }
})

const stylesApp = withStyles(styles, {withTheme: true})(App);

;(async () => {
  console.log('You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.');
})()

const connectedApp = connect<StateProps, DispatchProps, {}, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(stylesApp);

export { connectedApp as App }
//export default hot(App) //https://github.com/gaearon/react-hot-loader/tree/master/examples/typescript/src

/*
let exo: {
  toggleSidebar: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, from: string) => PayloadAction<"@@app/TOGGLE_SIDEBAR", {}>;
}
*/