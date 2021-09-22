import { ActionType, getType } from 'typesafe-actions'
import { WidgetAction } from '../actions'
import { Reducer }  from 'redux'

export interface WidgetState {
    moreButtonRef: any
}

export const widgInitialState: WidgetState = {
    moreButtonRef: null //used for anchor el val
}

type WidgetAction = ActionType<typeof WidgetAction>;

const widgReducer: Reducer<WidgetState, WidgetAction> = (state: WidgetState = widgInitialState, action: WidgetAction): WidgetState => {
    switch(action.type) {

        case getType(WidgetAction.handleMenu):
            return {
                ...state, moreButtonRef: action.payload.moreButtonRef
            }

        case getType(WidgetAction.handleCloseMenu):
            return {
                ...state, moreButtonRef: action.payload.moreButtonRef
            }

        default: 
            return state

    }
}

export { widgReducer as WidgetReducer }