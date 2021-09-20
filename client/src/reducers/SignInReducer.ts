import { ActionType, getType } from 'typesafe-actions'
import { SignInAction } from '../actions'
import { Reducer }  from 'redux'
import { history } from '../App'

export interface SignInState {
    email: string
    password: string
    error: string
    errOpen: boolean
}

export const sigIinitialState: SignInState = {
    email: "", password: "", error: "", errOpen: false
}

type SignInAction = ActionType<typeof SignInAction>;

const sigIReducer: Reducer<SignInState, SignInAction> = (state: SignInState = sigIinitialState, action: SignInAction): SignInState => {
    switch(action.type) {
        case getType(SignInAction.doSign.failure):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        case getType(SignInAction.doSign.success):
            setTimeout(() => history.push('/', {...(action.payload), user: action.payload.user!}), 100)
            return {
                ...state, email: action.payload.email, password: action.payload.password
            }
        case getType(SignInAction.handleChange):
            return {
                ...state, [action.payload.propName]: action.payload.propValue
            }
        case getType(SignInAction.handleCloseErr):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        case getType(SignInAction.toSignUp):
            history.push('/signup')
            return {
                ...state, email: action.payload.email, password: action.payload.password
            }
        default:
            return state
    }
}

export default sigIReducer