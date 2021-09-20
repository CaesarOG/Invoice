import { ActionType, getType } from 'typesafe-actions'
import { InvoiceDetAction } from '../actions'
import { Reducer }  from 'redux'
import { history } from '../App'
import { Invoice } from '../actions/services/models'

export interface InvoiceDetState {
    invoice: Invoice
}
 
export const cmpyDetInitialState: InvoiceDetState = {
    invoice: {name: '', description: '', billableHrs: 0.0, wageRate: 0.0, supplyCost: 0.0, status: '', 
    materials: [], notes: [], due: new Date()}
}

type InvoiceDetAction = ActionType<typeof InvoiceDetAction>;

const cmpyDetReducer: Reducer<InvoiceDetState, InvoiceDetAction> = (state: InvoiceDetState = cmpyDetInitialState, action: InvoiceDetAction): InvoiceDetState => {
    switch(action.type) {
        case getType(InvoiceDetAction):
            history.push(`/founder/${action.payload.founId}`)
            return state

        case getType(InvoiceDetAction):
            return {
                ...state, company: action.payload.company
            }

        default:
            return state
    }
}

export { cmpyDetReducer as InvoiceDetReducer }