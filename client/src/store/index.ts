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

const store = createStore(rootReducer, initialState, composeEnhancers );

epicMiddleware.run(rootEpic);

export default store