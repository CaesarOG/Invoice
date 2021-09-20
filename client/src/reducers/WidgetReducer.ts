import { ActionType, getType } from 'typesafe-actions'
import { WidgetAction, BigStatAction, SliderAction, PayWallAction } from '../actions'
import { Reducer }  from 'redux'
import { Funder, Founder, Notification } from '../actions/services/models';
import { history } from '../App'

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



export interface BigStatState {

}

export const bgStInitialState: BigStatState = {

}

type BigStatAction = ActionType<typeof BigStatAction>;

const bgStReducer: Reducer<BigStatState, BigStatAction>  = (state: BigStatState = bgStInitialState, action: BigStatAction): BigStatState => {
    switch(action.type) {

        case getType(BigStatAction.handleChangeTimePd):
            return {
                ...state, [action.payload.selectName]: action.payload.selectValue
            }

        default:
            return state

    }
}

export { bgStReducer as BigStatReducer }



export interface SliderState {
    values: number[]
}

export const slInitialState: SliderState = {
    values: []
}

type SliderAction = ActionType<typeof SliderAction>;

const slReducer: Reducer<SliderState, SliderAction> = (state: SliderState = slInitialState, action: SliderAction): SliderState => {
    switch(action.type) {

        case getType(SliderAction.handleChangeSlider):
            return {
                ...state, values: action.payload.values
            }
        
        default:
            return state
    }
}

export { slReducer as SliderReducer }



export interface PayWallState {
    funder?: Funder
    founder?: Founder
    ntfn: Notification
    activeCmpy?: number
    firmDetOrNtfn: string
    dialogOpen: boolean
    fromAccpOrBuy: boolean
}

export const pwInitialState: PayWallState = {
    funder: undefined, founder: undefined, ntfn: {companyID: '', funderID: '', type: ''}, activeCmpy: undefined, firmDetOrNtfn: "firmDet", 
    dialogOpen: true, fromAccpOrBuy: false
}

type PayWallAction = ActionType<typeof PayWallAction>;

const pwReducer: Reducer<PayWallState, PayWallAction> = (state: PayWallState = pwInitialState, action: PayWallAction): PayWallState => {
    switch(action.type) {

        case getType(PayWallAction.getDeterminers):
            return {
                ...state, ...(action.payload)
            }

        case getType(PayWallAction.OKcmpyNtfn.success):
            return {
                ...state, funder: action.payload, fromAccpOrBuy: true
            }

        case getType(PayWallAction.NOcmpyNtfn):
            setTimeout(() => history.push('/'), 100)
            return {
                ...state
            }
        
        case getType(PayWallAction.OKfundNtfn.success):
            return {
                ...state, founder: action.payload, fromAccpOrBuy: true
            }

        case getType(PayWallAction.NOfundNtfn):
            setTimeout(() => history.push('/'), 100)
            return {
                ...state
            }

        case getType(PayWallAction.cdtDialogOpen):
            return {
                ...state, dialogOpen: action.payload.dialogOpen
            }

        case getType(PayWallAction.buyCredits):
            return {
                ...state, fromAccpOrBuy: true, ...(action.payload)
            }

        default:
            return state
    }
}

export { pwReducer as PayWallReducer }