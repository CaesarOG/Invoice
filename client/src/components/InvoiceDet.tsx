import React from 'react'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { Grid, Theme, withStyles, createStyles, WithStyles } from '@material-ui/core';
import { ResponsiveContainer } from 'recharts';
import { CompanyDetAction } from '../actions' 
import { Widget, Typography } from './WidgetAndWrappers'
import { CompanyDetState } from '../reducers/InvoiceDetReducer'
import MUIDataTable from 'mui-datatables'
import { RouteComponentProps } from 'react-router-dom';

//before it was a function that manually said return and the object
const mapStateToProps: MapStateToProps<CompanyDetState, {}, RootState> = (state: RootState) => ({
  company: state.CompanyDetReducer.company
});

type CompanyDetAction = ActionType<typeof CompanyDetAction>;
//Map Redux Actions to component props
const mapDispatchToProps = {
  getCmpy: CompanyDetAction.cmpyDet.request,
  clickFounder: CompanyDetAction.clickFounDet,
  clickPrincDiv: CompanyDetAction.clickFounDet
}

type StateProps = ReturnType<typeof mapStateToProps>; 
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = WithStyles<typeof styles> & RouteComponentProps<any> & {theme: Theme};
type Props = StateProps & DispatchProps & OwnProps;

class CompanyDet extends React.Component<Props, {}> {

  componentDidMount() {//https://tylermcginnis.com/react-router-query-strings/
    const id = this.props.match.params.id as string
    this.props.getCmpy(id!)
  }


  render() {
    const { company, classes, clickFounder, clickPrincDiv } = this.props
    let cmpyLoaded = Boolean(company.principal)
    const fuckyourselfyoucrypticasshole = [{ID: '5', email: 'a', phone: '', user: {lastName: 'fahk'}}, {ID: '5', email: 'a', phone: '', user: {lastName: 'fahk'}}]
    return ( 
      <div className={classes.root}>
        <Grid container spacing={5} alignItems="center" direction="row" justify="space-evenly">
          <Grid item lg={4} md={4} sm={6} xs={12}>
            { cmpyLoaded && 
            <Widget title="Contact Details" bodyClass={classes.fullHeightBody} className={classes.card}>
              <div className={classes.serverOverviewElement} onClick={() => clickPrincDiv(company.principal!.ID)}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Principal's Name </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}>
                      {company.principal!.user.firstName + " " + company.principal!.user.lastName}
                    </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement} onClick={() => clickPrincDiv(company.principal!.ID)}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Principal's Email </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%">
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {company.principal!.user.email} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement} onClick={() => clickPrincDiv(company.principal!.ID)}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Principal's Phone </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {company.principal!.phone} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
            </Widget>
            }
          </Grid>
          <Grid item lg={4} md={4} sm={6} xs={12}>
            { cmpyLoaded &&
            <Widget title="Address and Industry" bodyClass={classes.fullHeightBody} className={classes.card}>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Street Address </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {company.address} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> State </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {company.state} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={classes.serverOverviewElement}>
                <Typography colorBrightness="dark" variant="h5" className={classes.serverOverviewElementText}> Industry </Typography>
                <div className={classes.serverOverviewElementChartWrapper}>
                  <ResponsiveContainer height={50} width="99%"> 
                    <Typography colorBrightness="dark" className={classes.serverOverviewElementText}> {company.industry} </Typography>
                  </ResponsiveContainer>
                </div>
              </div>
            </Widget>
            }
          </Grid>
          { (company && company.founders) && (
          <Grid item xs={12}>
            <MUIDataTable title="Founders" data={fuckyourselfyoucrypticasshole} columns={[ {name: 'ID', options: {display: "excluded"}}, {name: "email", label: "Email"}, 
              {name: "phone", label: "Phone"}, {name: "user.lastName", label: "Founder Name" } ]}
              options={{
                filterType: "dropdown" as any, responsive: 'scroll' as any, download: false, print: false, pagination: false, search: false, 
                onRowClick: (rowData) => clickFounder(rowData[0]), serverSide: true, selectableRows: 'none'
              }} 
            />
          </Grid>
          )}
        </Grid>
      </div>
    );
  }
}


// const TransitionRight = (props: any) => {
//   return <Slide {...props} direction="right" />;
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {   PaperProps: {  style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 }  }   };

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

const stylesCompanyDet = withStyles(styles, { withTheme: true })(CompanyDet)

//Connected Component
const connectedCompanyDet = connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps
)(stylesCompanyDet);

export { connectedCompanyDet as CompanyDet }

