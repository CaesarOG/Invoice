import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { Avatar, Paper, Snackbar, Typography, Grid, createStyles, Button, 
  TextField, Chip, MenuItem, Select, Input, FormControl, InputLabel, Slide,
  WithStyles, withStyles, Theme, Stepper, Step, StepLabel, CssBaseline,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Box } from '@material-ui/core';
import { EditInvoiceAction } from '../actions'
import MySnackbarContent from './MySnackbarContent'
import { editInvinitialState, EditInvoiceState } from '../reducers/EditInvoiceReducer'
import { FrgnField, createPropsGetter, Invoice, obj, User } from '../actions/services/models';
import { RouteComponentProps } from 'react-router';
//import { timeInterval } from 'rxjs/operators';



//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<EditInvoiceState, {}, RootState> = (state: RootState) => ({
  ...(state.EditInvoiceReducer)
});

type EditInvoiceAction = ActionType<typeof EditInvoiceAction>;
// Map Redux Actions to component props
const mapDispatchToProps = {
  handleChange: EditInvoiceAction.handleChange,
  handleChangeSelect: EditInvoiceAction.handleChangeSelect,
  handleCloseErr: EditInvoiceAction.handleCloseErr,
  getInvItems: EditInvoiceAction.getFormItems.request,
  addNote: EditInvoiceAction.addNote,
  editcr8Req: EditInvoiceAction.editOrCreateInv.request,
  handleChangeSingleSel: EditInvoiceAction.handleChangeSingleSel,
  setInv: EditInvoiceAction.setInv
}

const styles = (theme: Theme) => createStyles({
  root: {
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

});

type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = RouteComponentProps<any> & {theme: Theme, invoice: Invoice};
type defaultStateProps = Readonly<typeof editInvinitialState>; type defaultDispatchProps = Readonly<typeof EditInvoiceAction>; //solution: https://medium.com/@martin_hotell/react-typescript-and-defaultprops-dilemma-ca7f81c661c7
type Props = Partial<StateProps & DispatchProps & OwnProps> & WithStyles<typeof styles>; 
const getProps = createPropsGetter(Object.assign({}, editInvinitialState, mapDispatchToProps))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class EditInvoice extends React.Component<Props, {}> {
 
  componentDidMount() {
    //const id = this.props.match?.params.id as string
    let invoice: Invoice = (this.props.location!.state as obj) && (this.props.location!.state as obj).invoice
    let edCr8: string = (this.props.location!.state as obj) && (this.props.location!.state as obj).edcr8
    let user: User = (this.props.location!.state as obj) && (this.props.location!.state as obj).user
    invoice = (!invoice || !invoice.name) ? new Invoice():invoice
    this.props.setInv!(invoice, user, edCr8)
    if(!invoice || !invoice.name) this.props.getInvItems!({edCr8})
    else this.props.getInvItems!({edCr8})
  }

  render() {
    const { classes, error, errOpen, handleCloseErr, handleChangeSelect, handleChange, custEmails, editcr8Req, stringtoMats,
      materials, materialsChecked, handleChangeSingleSel, invoice, note, addNote, editOrCreate,
      description, name, billableHrs, wageRate, supplyCost, custEmail } = getProps(this.props)
    let stepTxt = [['Click Edit', 'Editing Invoice'], ['Click Create', 'Creating Invoice']]

    return (
      <div className={classes.root} > {/*was a React.Fragment, switched to div for className*/}
      <CssBaseline />
      <Typography component="h1" variant="h4" align="center" className={classes.typog}>
        {editOrCreate==='Create'?"Create Invoice":"Edit Invoice"}
      </Typography>
      <Stepper activeStep={1} className={classes.stepper}>
        {[{lab: 0, txt: editOrCreate==='Create'?stepTxt[1][0]:stepTxt[0][0]}, {lab: 1, txt: editOrCreate==='Create'?stepTxt[1][1]:stepTxt[0][1]}].map(item => (
          <Step key={item.lab}>
            <StepLabel>{item.txt}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
              <Grid item xs={12} >
                <Box component="form">
                  <div>
                    <TextField label="Name" placeholder="Name" className={classes.textField} name="name" value={name}
                      onChange={handleChange} margin="normal" variant="outlined" />
                    <TextField label="Description" placeholder="Description" className={classes.textField} name="description" value={description}
                      onChange={handleChange} margin="normal" variant="outlined" />
                    <TextField label="Billable Hrs" placeholder="1.0" className={classes.textField} name="billableHrs" value={billableHrs}
                      onChange={handleChange} margin="normal" variant="outlined" type="number" />
                    <TextField label="Wage Rate" placeholder="1.0" className={classes.textField} name="wageRate" value={wageRate}
                      onChange={handleChange} margin="normal" variant="outlined" type="number" />
                    <TextField label="Supply Cost" placeholder="1.0" className={classes.textField} name="supplyCost" value={supplyCost}
                      onChange={handleChange} margin="normal" variant="outlined" type="number" />
                  </div>
                </Box>
              </Grid>
              {editOrCreate !== "Edit" && (
              <Grid item xs={12}>
                  <FormControl variant="outlined" required className={classes.inpWidth} fullWidth>
                    <InputLabel htmlFor="custEmail">Select Customer</InputLabel>
                    <Select value={custEmail} name="custEmail" fullWidth className={classes.inpWidth}
                      onChange={handleChangeSingleSel} input={<Input id="custEmail" className={classes.inpWidth} fullWidth/>} MenuProps={MenuProps}
                    >
                      {custEmails.map( ce => (
                        <MenuItem key={ce.email+"Cm"} value={ce.email}> {ce.email} </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              </Grid>
              )}
              { (materials && materials.length !== 0) && (
              <React.Fragment>
                <Grid item xs={12}>
                  <FormControl required className={classes.inpWidth} fullWidth>
                    <InputLabel htmlFor="states">Materials</InputLabel>
                    <Select multiple value={materialsChecked} name="materialsChecked" fullWidth className={classes.inpWidth}
                      onChange={handleChangeSelect} input={<Input id="materialsChecked" className={classes.inpWidth} fullWidth/>} MenuProps={MenuProps}
                      renderValue={ (selected: any) => (
                        <div className={classes.chips}>
                          {selected.map( (value: string) => (
                            <Chip key={value+"C"} avatar={<Avatar>{ value.slice(0, 2) }</Avatar>} 
                              clickable label={value} color="primary" variant="outlined" className={classes.chip} />
                          ))}
                        </div>
                      )}
                    >
                      {materials.map( material => (
                        <MenuItem key={material.name+"M"} value={material.name} style={getStyles(material, materials, this)}>
                          {material.name!}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                { (invoice.notes && invoice.notes.length !== 0) && (
                <Grid item xs={12}>
                  <List > {/*sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}*/}
                    {invoice.notes.map((note, idx) => (
                      <React.Fragment>
                      <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Note">{note.message!.slice(0, 2).toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={note.message!.split(' ').slice(0,2).join(" ")+"..."} secondary = {
                          <React.Fragment>
                            <Typography component="span" variant="body2">
                              {note.message!}  
                            </Typography>
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
                )}
                <Grid item xs={12}>
                  <FormControl required>
                    <TextField label="Note" multiline rows={4} placeholder="Text" className={classes.textField} name="note" value={note}
                      onChange={handleChange} margin="normal" variant="outlined" />
                  <Button variant="contained" color="primary" onClick={(e) => {addNote(note)}} className={classes.button}> Add Note </Button>
                  </FormControl>

                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={(e) => editcr8Req({materials, materialsChecked, editOrCr8: editOrCreate, stringtoMats})} 
                    className={classes.button}> {editOrCreate==="Create"?"Create Invoice":"Apply Edit Invoice"} </Button>
                </Grid>

              </React.Fragment>       
              )}
            </Grid>
            </Paper>
          </main>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={errOpen} autoHideDuration={6000} onClose={handleCloseErr}
          TransitionComponent={TransitionRight}
        >
          <MySnackbarContent variant="error" message={error} className={classes.margin} onClose={handleCloseErr} />
        </Snackbar>
      </React.Fragment>
      </div>
    );
  }
}


function getStyles(elt: FrgnField, array: Array<FrgnField>, that: EditInvoice) {
  return { fontWeight: array.indexOf(elt) === -1 ? that.props.theme!.typography.fontWeightRegular : that.props.theme!.typography.fontWeightMedium }
}

function TransitionRight(props: any) { //ComponentProps in react?
  return <Slide {...props} direction="right" />;
}

const stylesEditInvoice = withStyles(styles, { withTheme: true })(EditInvoice)

//Connected Component
const connectedEditInvoice = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesEditInvoice);

export { connectedEditInvoice as EditInvoice }