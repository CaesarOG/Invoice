import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { Grid, Theme, withStyles, createStyles, WithStyles, List, ListItem, ListItemAvatar, ListItemText,
Avatar, Divider, Button, Typography as TypogCore, Snackbar, Slide } from '@material-ui/core';
import { ResponsiveContainer } from 'recharts';
import { InvoiceDetAction } from '../actions'
import { obj } from '../actions/services/models'
import { Widget, Typography } from './WidgetAndWrappers'
import MySnackbarContent from './MySnackbarContent'
import { InvoiceDetState } from '../reducers/InvoiceDetReducer'
import { RouteComponentProps } from 'react-router-dom';

//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<InvoiceDetState, {}, RootState> = (state: RootState) => ({
  ...(state.InvoiceDetReducer)
});

type InvoiceDetAction = ActionType<typeof InvoiceDetAction>;
//Map Redux Actions to component props
const mapDispatchToProps = {
  getInvc: InvoiceDetAction.getInvoice.request,
  clickEdit: InvoiceDetAction.editcr8,
  setInv: InvoiceDetAction.setInv,
  handleCloseErr: InvoiceDetAction.handleCloseErr
}

type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = WithStyles<typeof styles> & RouteComponentProps<any> & {theme: Theme};
type Props = StateProps & DispatchProps & OwnProps;

class InvoiceDet extends React.Component<Props, {}> {

  componentDidMount() {//https://tylermcginnis.com/react-router-query-strings/
    const id = this.props.match.params.id as string
    let invoice = (this.props.location.state! as obj) && (this.props.location.state! as obj).inv
    let user = (this.props.location.state! as obj) && (this.props.location.state! as obj).user
    if (!invoice || !invoice.name) {
      this.props.getInvc({user, id})
    } else this.props.setInv(invoice, id, user)
  }

  render() {
    const { classes, invoice, user, clickEdit, errOpen, error, handleCloseErr } = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={5} alignItems="center" direction="row" justify="space-evenly">
          { (user && user.role && user.role === "Contractor") && 
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={(e) => clickEdit(invoice, user)}
              className={classes.button}> Edit Invoice </Button>
          </Grid>
          }
          <Grid item lg={6} md={6} sm={6} xs={12}>
            { invoice &&
            <Widget title="Invoice Descr." bodyClass={classes.fullHeightBody} className={classes.card}>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Name </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}>
                      {invoice.name}
                    </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Description </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%">
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {invoice.description} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Due Date </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {invoice.dueDate.toDateString()} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
            </Widget>
            }
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            { invoice &&
            <Widget title="Financial Details" bodyClass={classes.fullHeightBody} className={classes.card}>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Billable Hours </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {invoice.billableHrs} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Labor Cost (Hrs x Wage) </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> $ {invoice.billableHrs * invoice.wageRate} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Cost of Supplies </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> $ {invoice.supplyCost} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
            </Widget>
            }
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <List > {/*sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}*/}
              {invoice.materials.map((mat, idx) => (
                <React.Fragment>
                <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Material">{mat.name!.slice(0,2).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={mat.name!} secondary = {
                    <React.Fragment>
                      <Typography variant="body2">
                        {" "}
                      </Typography>
                      {" "}
                    </React.Fragment>
                  }
                />
              </ListItem>
              { idx !== invoice.materials.length - 1 && <Divider variant="inset" component="li" /> }
              </React.Fragment>
              )) }
            </List>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
          <List > {/*sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}*/}
            {invoice.notes.map((note, idx) => (
              <React.Fragment>
              <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Note">{note.message!.slice(0, 2).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={note.message!.split(' ').slice(0,2).join(" ")+"..."} secondary = {
                  <React.Fragment>
                    <TypogCore component="span" variant="body2">
                      {note.message!}  
                    </TypogCore>
                    {"  "}
                  </React.Fragment>
                }
              />
            </ListItem>
            { idx !== invoice.notes.length - 1 && <Divider variant="inset" component="li" /> }
            </React.Fragment>
            )) }
                  </List>
          </Grid>
        </Grid>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errOpen} autoHideDuration={6000} onClose={handleCloseErr}
          TransitionComponent={TransitionRight}
        >
          <MySnackbarContent variant="error" message={error} className={classes.margin} onClose={handleCloseErr} />
        </Snackbar>
      </div>
    );
  }
}


function TransitionRight(props: any) { //ComponentProps in react?
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
    margin: theme.spacing(1)
  },
  heightDiv: {
    height: theme.spacing(3)
  },
  rootOne: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  inpWidth: {
    width: '100%',
    flexGrow: 1,
    boxSizing: 'border-box'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fullHeightBody: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  formControl: {
    margin: theme.spacing(3),
  },
  fontWeightReg: {
    fontWeight: theme.typography.fontWeightRegular,
  }, 
  fontWeightMed: {
    fontWeight: theme.typography.fontWeightMedium,
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
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  demo: {
    height: 240,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  card: {
    maxWidth: 345,
    minHeight: "100%",
    display: "flex",
    flexDirection: "column"
  },
  media: {
    height: 140,
  },
  serverOverviewElement: {
    display: "flex",
    alignItems: "center",
    maxWidth: "100%"
  },
  serverOverviewElementText: {
    minWidth: 145,
    padding: theme.spacing(2)
  },
  serverOverviewElementChartWrapper: {
    width: "100%"
  },
  mainChartBody: {
    overflowX: 'auto',
  },
  mainChartHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      flexWrap: 'wrap',
    }
  },
  mainChartHeaderLabels: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: {
      order: 3,
      width: '100%',
      justifyContent: 'center',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    }
  },
  mainChartHeaderLabel: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(3),
  },
  mainChartSelectRoot: {
    borderColor: theme.palette.text.hint + '80 !important',
  },
  mainChartSelect: {
    padding: 10,
    paddingRight: 25
  },
  mainChartLegendElement: {
    fontSize: '18px !important',
    marginLeft: theme.spacing(1),
  },
});

const stylesInvoiceDet = withStyles(styles, { withTheme: true })(InvoiceDet)

//Connected Component
const connectedInvoiceDet = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesInvoiceDet);

export { connectedInvoiceDet as InvoiceDet }

