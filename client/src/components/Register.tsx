import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { Avatar, Paper, Slide, Snackbar, Typography, withStyles, 
  WithStyles, createStyles, Button, TextField, Theme } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { RegisterAction } from '../actions'
import { createPropsGetter } from '../actions/services/models';
import MySnackbarContent from './MySnackbarContent'
import { RegisterState, reginitialState } from '../reducers/RegisterReducer'

//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<RegisterState, {}, RootState> = (state: RootState) => ({
  firstName: state.RegisterReducer.firstName,
  lastName: state.RegisterReducer.lastName,
  email: state.RegisterReducer.email,
  password: state.RegisterReducer.password, 
  confirmPassword: state.RegisterReducer.confirmPassword,
  error: state.RegisterReducer.error,
  errOpen: state.RegisterReducer.errOpen,
});

type RegisterAction = ActionType<typeof RegisterAction>;
//Map Redux Actions to component props
const mapDispatchToProps = {     
  doRegReq: RegisterAction.doReg.request,
  handleChange: RegisterAction.handleChange,
  handleCloseErr: RegisterAction.handleCloseErr,
  backSignIn: RegisterAction.backSignIn
}

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1)
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
  buttonOne: {
    marginTop: theme.spacing(3),
  },
  buttonTwo: {
    marginTop: theme.spacing(1),
  }
});

type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {theme: Theme};
type Props = Partial<StateProps & DispatchProps & OwnProps> & WithStyles<typeof styles>;
const getProps = createPropsGetter(Object.assign({}, reginitialState, mapDispatchToProps))

class Register extends React.Component<Props, {}> {

  render() {
    const { classes, firstName, lastName, email, password, confirmPassword, error, errOpen, handleChange, doRegReq, backSignIn, handleCloseErr } = getProps(this.props)
    return (
      <React.Fragment>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlined />
            </Avatar>
            <Typography variant="h5">Sign Up</Typography>
            <br />
            <TextField label="First Name" placeholder="First Name" className={classes.textField} name="firstName" value={firstName}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <TextField label="Last Name" placeholder="Last Name" className={classes.textField} name="lastName" value={lastName}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />
            <TextField label="Enter your Email" placeholder="Email" className={classes.textField} name="email" value={email}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />
            <TextField type="password" label="Enter your Password" placeholder="Password" className={classes.textField} name="password" value={password}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />
            <TextField type="password" label="Confirm Password" placeholder="Confirm Password" className={classes.textField} name="confirmPassword" value={confirmPassword}
              onChange={handleChange} margin="normal" variant="outlined" fullWidth
            />
            <br />

            <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
              <Grid item xs={12}>
                <FormControl component={"fieldset" as "div"} className={classes.formControl}>   {/* fieldset https://github.com/mui-org/material-ui/issues/13744*/}
                  <FormGroup row>
                    <FormControlLabel control={ 
                      <Switch id="founderBool" checked={founderBool} value={founderBool} onChange={handleChangeSwitch} disabled={funderBool}/>
                      } 
                      label="Founder"
                    />
                    <FormControlLabel control={
                      <Switch id="funderBool" checked={funderBool} value={funderBool} onChange={handleChangeSwitch} disabled={founderBool}/>
                      }
                      label="Funder"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              variant="contained" color="primary" className={classes.buttonOne}
              fullWidth
              onClick={doRegReq}
            >
              Submit
            </Button>
            <br />
            <Button
              variant="contained" color="primary" className={classes.buttonTwo} fullWidth
              onClick={backSignIn}
            >
              Back To Sign In
            </Button>
          </Paper>
        </main>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} open={errOpen} autoHideDuration={6000} onClose={handleCloseErr}
          TransitionComponent={TransitionRight}
        >
          <MySnackbarContent variant="error" message={error} className={classes.margin} onClose={handleCloseErr} />
        </Snackbar>
      </React.Fragment>
    )
  }
}

function TransitionRight(props: any) {
  return <Slide {...props} direction="right" />;
}

const stylesRegister = withStyles(styles)(Register)

//Connected Component
const connectedRegister = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesRegister);

export { connectedRegister as Register }
