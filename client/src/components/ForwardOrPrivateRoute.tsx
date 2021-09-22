import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import services from '../actions/services'
import { User, obj } from '../actions/services/models';
import { ConnectedComponent } from 'react-redux';
import { InvoicesHome, EditInvoice } from './'


type FwdRt = { SignIn?: ConnectedComponent<any, any>, SignUp?: ConnectedComponent<any, any> }
export const ForwardRoute: React.FC<RouteProps & FwdRt> = props => {
  const user = services.localStorage.loadItem<User>('user')
  let { SignIn, SignUp:pre } = props
return <Route path={props.path} {...props} render={
  props => { 
    if (user&&user.role !== null && user.role !== "") { 
      return <Redirect to={{pathname: "/", state: {user}}} /> 
    } else {
      if(SignIn) { 
        return <SignIn {...props} />
      } else {
        let SignUp = pre as ConnectedComponent<any, any>; 
        return <SignUp {...props} /> 
      } 
    } 
  }} />
}
//http://mtgkuy.blogspot.com/2019/01/typescript-3-jsx-element-type-component.html#, bury face grnd, scratch midsc, cat stretch, hump leg, shake+sneeze

export const PrivateHome: React.FC<RouteProps> = props => {
  //console.log(  (history.location.state! as obj).user + " !!!! the user from useHistory!!")
  var user: User
  var fromOther: Boolean = false
  if (props.location && props.location!.state && (props.location!.state! as obj).user) {
    user = (props.location!.state! as obj).user
    fromOther = true
  } else {
    user = services.localStorage.loadItem<User>('user')
  }

  return <Route path={props.path} {...props} render={ 
  props => { 
    if (fromOther || (user&&user.role !== null && user.role !== "") ) {
      return <InvoicesHome {...props} />
    } 
    else {
      return <Redirect to="/signin" />
    }
  } } />
}

export const OnlyContr: React.FC<RouteProps> = props => {
  //console.log(  (history.location.state! as obj).user + " !!!! the user from useHistory!!")
  var user: User
  var fromOther: Boolean = false
  if (props.location && props.location!.state && (props.location!.state! as obj).user) {
    user = (props.location!.state! as obj).user
    fromOther = true
  } else {
    user = services.localStorage.loadItem<User>('user')
  }

  return <Route path={props.path} {...props} render={ 
  props => { 
    if (fromOther || (user&&user.role !== null && user.role === "Contractor") ) {
      return <EditInvoice {...props} />
    } 
    else {
      return <Redirect to={{pathname: "/", state: {user}}} />
    }
  } } />
}

type PrivateRouteProps = {comp: ConnectedComponent<any, any>}; 
export const PrivateRoute: React.FC<RouteProps & PrivateRouteProps> = ({comp:Comp, ...props}) => {
  return <Route path={props.path} {...props} render={ 
            props => { 
            console.log(props.history.location)
            if (services.localStorage.loadItem<string>('token')) { 
              return  <Comp {...props} /> 
            } else {
              return <Redirect to={(props.location.state! as obj).from as string} />
            }
            }  } />
  //services.localStorage.loadItem<string>('token') ? <Route {...props} />
}

//https://codedaily.io/tutorials/49/Create-a-ProtectedRoute-for-Logged-In-Users-with-Route-Redirect-and-a-Render-Prop-in-React-Router
//may need another  <Route {...rest} render={ props => } /> to wrap the inner json parse redirect section.
//type FwdRtHome = { SignIn?: ConnectedComponent<any, any> | undefined, SignUp?: ConnectedComponent<any, any> | undefined }
//type FwdRtProps = { location?: H.Location | undefined, path?: string | string[] | undefined, component: ConnectedComponent<any, any> }