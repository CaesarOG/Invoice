import React from 'react'
import { connect, MapStateToProps } from 'react-redux'
import { CssBaseline, Theme, 
  Typography, withStyles, WithStyles, createStyles } from '@material-ui/core';
import { Register } from './Register'
import { RootState } from 'MyTypes'
import { SignUpState } from '../reducers/SignUpReducer'


//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<SignUpState, {}, RootState> = (state: RootState) => ({
});

type StateProps = ReturnType<typeof mapStateToProps>; 
type OwnProps = WithStyles<typeof styles> & {theme: Theme};
type Props = StateProps & OwnProps; 


class SignUp extends React.Component<Props, {}> {

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}> {/*was a React.Fragment, switched to div for className*/}
        <CssBaseline />
        <Typography component="h1" variant="h4" align="center" className={classes.typog}>
          Sign Up
        </Typography>
        <Register />
      </div>
    )
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  appBar: {
    position: 'relative',
  },
  grow: {
    flexGrow: 1,
  },
  stepper: {
    padding: `${theme.spacing(3)}px 0 ${theme.spacing(5)}px`,
    margin: theme.spacing(2),
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  typog: {
    marginTop: theme.spacing(1)
  }
});

const stylesSignUp = withStyles(styles)(SignUp)

//Connected Component
const connectedSignUp = connect<StateProps, {}, {}, RootState>(
    mapStateToProps
)(stylesSignUp);

export { connectedSignUp as SignUp }
