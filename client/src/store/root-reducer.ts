import { combineReducers } from  'redux'
import { SignInReducer, SignUpReducer, RegisterReducer, EditInvoiceReducer,
  InvoicesHomeReducer, WidgetReducer, HeaderReducer, SideBarReducer,
  InvoiceDetReducer, AppReducer } from '../reducers'

//if you try to add generic to combineReducers it will complain that you are referencing reducer in its own type annotation (since rootreducer IS rootstate)
export default combineReducers({
    // SignInReducer, SignUpReducer, RegisterReducer, FounderOrFunderReducer, FounderHomeReducer, FunderHomeReducer
    SignInReducer, SignUpReducer, RegisterReducer, InvoicesHomeReducer, EditInvoiceReducer, 
    WidgetReducer, HeaderReducer, SideBarReducer, InvoiceDetReducer, AppReducer
});