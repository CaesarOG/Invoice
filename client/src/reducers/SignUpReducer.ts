import { ActionType, getType } from 'typesafe-actions'
import { SignUpAction } from '../actions'
import { Reducer }  from 'redux'

export interface SignUpState {
    activeStep: 0 | 1
}

export const sigUinitialState: SignUpState = {
    activeStep: 0 as 0 | 1
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