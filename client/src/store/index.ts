import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { RootAction, RootState, Services } from 'MyTypes'
import rootReducer from './root-reducer'
import rootEpic from './root-epic'
//import rootAction from './root-action'
import { reginitialState, sigIinitialState, 
  sigUinitialState, widgInitialState, hDinitialState, sBinitialState,
  invHinitialState, invcDetInitialState, appInitialState, editInvinitialState } from '../reducers'
import { createEpicMiddleware } from 'redux-observable'
import services from '../actions/services';


const epicMiddleware = createEpicMiddleware<
  RootAction, 
  RootAction, 
  RootState, 
  Services
>({
  dependencies: services
})

const middlewares = [epicMiddleware];

const composeEnhancers = composeWithDevTools(applyMiddleware(...middlewares))

const initialState: RootState = {
  EditInvoiceReducer: editInvinitialState,
  SignInReducer: sigIinitialState, 
  SignUpReducer: sigUinitialState,
  RegisterReducer: reginitialState,
  WidgetReducer: widgInitialState,
  HeaderReducer: hDinitialState,
  SideBarReducer: sBinitialState,
  InvoicesHomeReducer: invHinitialState,
  AppReducer: appInitialState,
  InvoiceDetReducer: invcDetInitialState
}

// const initialState = {
//   SignInReducer: {email: "", password: "", error: "", user: {}, errOpen: false},
//   RegisterReducer: {name: "", email: "", password: "", confirmPassword: "", error: "", user: {}, errOpen: false},
//   SignUpReducer: {activeStep: 0},
//   FounderOrFunderReducer: {founderBool: false, funderBool: false, errTicker: "", errTickerOpen: false, greens: true, errOpen: false, error: "", ticker: "", companyName: "", industries: [], states: [], industriesChecked: [], statesChecked: [] },
//   FounderHomeReducer: {founder: {}, anchorEl: null, error: "", url: "", source: "", message: "", errOpen: false, msgOpen: false, hashFinished: {"gaa": false} },
//   FunderHomeReducer: {funder: {}, anchorEl: null, msgOpen: false, message: "", error: "", errOpen: false, industries: [], states: [], industriesChecked: [], statesChecked: [] }
// }

const store = createStore(rootReducer, initialState, composeEnhancers );

epicMiddleware.run(rootEpic);

export default store