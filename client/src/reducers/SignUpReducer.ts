import { ActionType, getType } from 'typesafe-actions'
import { SignUpAction } from '../actions'
import { Reducer }  from 'redux'

export interface SignUpState {
}

export const sigUinitialState: SignUpState = {
}

type SignUpAction = ActionType<typeof SignUpAction>;

const sigUReducer: Reducer<SignUpState, SignUpAction> = (state: SignUpState = sigUinitialState, action: SignUpAction): SignUpState => {
    switch(action.type) {
        case getType(SignUpAction.secondActiveStep):
            return {
                ...state, activeStep: action.payload.activeStep
            }
        case getType(SignUpAction.reset):
            return {
                ...state, activeStep: action.payload.activeStep
            }
        default: 
            return state
    }
}

export default sigUReducer