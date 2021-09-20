import * as React from 'react'
import classNames from 'classnames'
import { IconButton, SnackbarContent, withStyles, WithStyles, createStyles, Theme } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { CheckCircle, Error, Close } from '@material-ui/icons'

const variantIcon = {
  success: CheckCircle,
  error: Error
}

type handleSnackBarClose = any

//enum variant { 'success', 'error' }
const styles = ({palette, spacing}: Theme) => createStyles({
  error: {
      backgroundColor: palette.error.dark,
      margin: spacing(1),
    },
  success: {
      backgroundColor: green[600],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: spacing(1),
  },
  message: {
  display: 'flex',
  alignItems: 'center',
  },
})
type OwnProps = WithStyles<typeof styles> & { className: string, message: React.ReactNode,
  onClose: handleSnackBarClose, variant: 'success'|'error'
};
type Props = OwnProps;

class MySnackbarContent extends React.Component<Props, {}> {

  render() {
      const { classes, className, message, onClose, variant, ...other } = this.props;
      const Icon = variantIcon[variant];
      return (
        <SnackbarContent className={classNames(classes[variant], className)} 
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} /> 
              {message}
            </span>
          }
          action={[ 
            <IconButton key="close" color="inherit" /*className={classes.close}*/ onClick={onClose} > 
              <Close className={classes.icon}/> 
            </IconButton>,
          ]}
          {...other}
        />
      )
  }
  
}

const stylesSnackBar = withStyles(styles)(MySnackbarContent)

export default stylesSnackBar 