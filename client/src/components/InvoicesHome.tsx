import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { Slide, Card, CardActionArea, CardActions, Theme, CardContent, CardMedia, 
  Snackbar, withStyles, Button, Grid, MenuItem, createStyles, WithStyles, Dialog, InputLabel,
  DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  Select, OutlinedInput } from '@material-ui/core';
import MySnackbarContent from './MySnackbarContent'
import { InvoicesHomeAction } from '../actions' 
import { Typography} from './WidgetAndWrappers'
import { InvoicesHomeState } from '../reducers/InvoicesHomeReducer'
import services from '../actions/services'
import { Dot } from '.'
import { User, obj } from '../actions/services/models';
import { RouteComponentProps } from 'react-router';
import MUIDataTable from 'mui-datatables'



//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<InvoicesHomeState, {}, RootState> = (state: RootState) => ({
  ...(state.InvoicesHomeReducer)
});

type InvoicesHomeAction = ActionType<typeof InvoicesHomeAction>;
//Map Redux Actions to component props
const mapDispatchToProps = {
  handleChangeSelect: InvoicesHomeAction.handleChangeSelect,
  handleCloseMsg: InvoicesHomeAction.handleCloseMsg,
  handleCloseErr: InvoicesHomeAction.handleCloseErr,
  getManyInvs: InvoicesHomeAction.getManyInvoices.request
}
type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = WithStyles<typeof styles> & RouteComponentProps<any> & {theme: Theme, user: User};
type Props = StateProps & DispatchProps & OwnProps

class InvoicesHome extends React.Component<Props, {}> {

  componentDidMount() {//https://tylermcginnis.com/react-router-query-strings/
    this.props.getManyInvs({query: '', offset: 0, limit: this.props.limit, place: 'sClose'}, this.props.user)
  }


  render() {
    const { handleCloseMsg, handleCloseErr, classes, error, message, errOpen, msgOpen, theme, handleChangeSelect } = this.props

    return ( 
      <div className={classes.root}>
        <React.Fragment>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <MUIDataTable title="All Founders" data={list} columns={[ {name: 'ID', options: {display: "excluded"}}, {name: "user.lastName", label: "Name"}, 
              {name: "email", label: "Email"}, {name: "phone", label: "Phone"}, {name: "cmpyPrinc", label: "Principal For"} ]}
              options={{ 
                page: currentPage,
                count: count,
                serverSide: true,
                searchText,
                selectableRows: 'none',
                filterType: "dropdown" as any, responsive: 'scroll' as any, download: false, print: false, onRowClick: founclickRow,
                onSearchChange: (query: string|null) => { updSearchTxt(query!); founSearchChange({query: query!, offset: 0, limit, place: "search"}) },
                onChangePage: (currentmeaningjustnew: number) => currentmeaningjustnew < currentPage ? undefined : 
                founChangePage({offset: currentmeaningjustnew*limit, limit, place: "page"}), /*onchangepage delivers current as the just changed to page*/
                onChangeRowsPerPage: (numRows: number) => founChangeRowsPerPage({offset: (currentPage-1)*limit, limit: numRows, place: "rows"}), 
                onSearchClose: () => founSearchChange({query: '', offset: 0, limit, place: "sClose"}) /*if query empty or if search close and then so query empty, reg pagin */
              }} 
            />
          </Grid>
        </Grid>
      </React.Fragment>
      </div>
    );
  }
}

function TransitionRight(props: any) {
  return <Slide {...props} direction="right" />;
}

function getStyles(elt: {[x:string]:any}, array: Array<{[x:string]:any}>, that: InvoicesHome) {
  return { fontWeight: array.indexOf(elt) === -1 ? that.props.theme.typography.fontWeightRegular : that.props.theme.typography.fontWeightMedium }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {   PaperProps: {  style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 }  }   };

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

const stylesInvoicesHome = withStyles(styles, { withTheme: true })(InvoicesHome)

//Connected Component
const connectedInvoicesHome = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesInvoicesHome);

export { connectedInvoicesHome as InvoicesHome }


/* https://stackoverflow.com/questions/49581529/array-of-objects-with-mui-datatables, 
https://stackoverflow.com/questions/58581404/how-do-i-render-an-array-of-items-inside-column-using-mui-data-tables, 
https://stackoverflow.com/questions/59183082/how-to-set-column-name-in-mui-datatables-using-object-key, 
https://github.com/gregnb/mui-datatables/blob/master/examples/data-as-objects/index.js, 
https://github.com/gregnb/mui-datatables/issues/147, https://github.com/gregnb/mui-datatables/issues/475 
https://github.com/gregnb/mui-datatables/issues/227, https://stackoverflow.com/questions/51905125/mui-datatables-server-side-rendering
https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-pagination/index.js, */