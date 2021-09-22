import { ActionType, getType } from 'typesafe-actions'
import { RegisterAction } from '../actions'
import { Reducer }  from 'redux'
import { history } from '../App'

export interface RegisterState {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    error: string
    errOpen: boolean
    isCust: boolean
    isContr: boolean
}

export const reginitialState: RegisterState = {
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "", error: "", errOpen: false, isCust: false, isContr: false
}

type RegisterAction = ActionType<typeof RegisterAction>;

const regReducer: Reducer<RegisterState, RegisterAction> = (state: RegisterState = reginitialState, action: RegisterAction): RegisterState => {
    switch(action.type) {
        case getType(RegisterAction.doReg.failure):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        case getType(RegisterAction.doReg.success):
        console.log("state "+state)
            return {
                ...state, firstName: action.payload.firstName, lastName: action.payload.lastName, email: action.payload.email, 
                    password: action.payload.password, confirmPassword: action.payload.confirmPassword
            }
        case getType(RegisterAction.handleChange):
            return {
                ...state, [action.payload.propName]: action.payload.propValue
            }
        case getType(RegisterAction.handleCloseErr):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        case getType(RegisterAction.backSignIn):
            history.goBack()
            return {
                ...state, firstName: action.payload.firstName, lastName: action.payload.lastName, email: action.payload.email, 
                password: action.payload.password, confirmPassword: action.payload.confirmPassword
            }
        case getType(RegisterAction.handleChangeSwitch):
            return {
                ...state, [action.payload.switchName]: action.payload.switchValue
            }
        default: 
            return state
    }
}

export default regReducer