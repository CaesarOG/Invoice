import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps 
import { Avatar, CssBaseline, Paper, Slide,
  Snackbar, Typography, Button, TextField,
  withStyles, WithStyles, createStyles, Theme } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import MySnackbarContent from './MySnackbarContent'
import { SignInAction } from '../actions'
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { SignInState } from '../reducers/SignInReducer'

//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<SignInState, {}, RootState> = (state: RootState) => ({
  email: state.SignInReducer.email,
  password: state.SignInReducer.password,
  error: state.SignInReducer.error,
  errOpen: state.SignInReducer.errOpen
});

type SignInAction = ActionType<typeof SignInAction>;
//Map Redux Actions to component props
const mapDispatchToProps = {     
  signReq: SignInAction.doSign.request,
  handleChange: SignInAction.handleChange,
  handleCloseErr: SignInAction.handleCloseErr,
  toSignUp: SignInAction.toSignUp 
}

type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = WithStyles<typeof styles> & {theme: Theme};
type Props = StateProps & DispatchProps & OwnProps; 

class SignIn extends React.Component<Props, {}> {

  render() {
    const { email, password, signReq, handleChange, handleCloseErr, toSignUp, classes, error, errOpen } = this.props
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <br />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5">Sign In</Typography>
            <br />
            <TextField 
              label="Enter your Email" placeholder="Email" className={classes.textField} name="email" value={email}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />
            <TextField
              type="password" label="Enter your Password" placeholder="Password" className={classes.textField} name="password" value={password}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />
            <Button
              variant="contained" color="primary" className={classes.buttonOne}
              fullWidth
              onClick={ () => { signReq({email, password}) } }
            >
              Log In
            </Button>
            <br />
            <Button
              variant="contained" color="primary" className={classes.buttonTwo} fullWidth
              onClick={ () => { toSignUp() } }
            >
              Sign Up
            </Button>
          </Paper>
        </main>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={errOpen} autoHideDuration={6000} onClose={handleCloseErr} TransitionComponent={TransitionRight}
        >
          <MySnackbarContent variant="error" className={classes.margin} message={error} onClose={handleCloseErr} />
        </Snackbar>
      </React.Fragment>
    )
  }
}

function TransitionRight(props: any) {
  return <Slide {...props} direction="right" />;
}

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  textField: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  buttonOne: {
    marginTop: theme.spacing(3),
  },
  buttonTwo: {
    marginTop: theme.spacing(1),
  }
});

const stylesSignIn = withStyles(styles)(SignIn)

//Connected Component
const connectedSignIn = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesSignIn);

export { connectedSignIn as SignIn }
