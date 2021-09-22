import { combineEpics } from 'redux-observable'
import { register, signin, getInv, invList, edOrCr8Inv, formItems } from '../actions'

export default combineEpics(...Object.values({ register, signin, getInv, invList, edOrCr8Inv, formItems })) //if there was just one epic you'd wrap in ...Object.values() before combine