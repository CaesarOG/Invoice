import { ActionType, getType } from 'typesafe-actions'
import { InvoiceDetAction } from '../actions'
import { Reducer }  from 'redux'
import { history } from '../App'
import { Invoice, User } from '../actions/services/models'

export interface InvoiceDetState {
    invoice: Invoice
    user: User
    id: string
    error: string
    errOpen: boolean
}

export const invcDetInitialState: InvoiceDetState = {
    invoice: new Invoice(), user: new User(), id: "", error: "", errOpen: false
}

type InvoiceDetAction = ActionType<typeof InvoiceDetAction>;

const invDetReducer: Reducer<InvoiceDetState, InvoiceDetAction> = (state: InvoiceDetState = invcDetInitialState, action: InvoiceDetAction): InvoiceDetState => {
    switch(action.type) {
        case getType(InvoiceDetAction.editcr8):
            history.push(`/editcr8`, {invoice: action.payload.inv, user: action.payload.usr, edcr8: "Edit"})
            return state        
            
        case getType(InvoiceDetAction.getInvoice.success):
            return {
                ...state, ...(action.payload), invoice: action.payload.inv!
            }

        case getType(InvoiceDetAction.getInvoice.failure):
            return {
                ...state, ...(action.payload)
            }

        case getType(InvoiceDetAction.setInv):
            if (action.payload.error && action.payload.usr.role !== 'Admin') { //NOT REAL ERROR, DUE DATE!
                return {
                    ...state, user: action.payload.usr, id: action.payload.id, invoice: action.payload.inv,
                    error: action.payload.error, errOpen: action.payload.errOpen
                }
            } else {
                return {
                    ...state, user: action.payload.usr, id: action.payload.id, invoice: action.payload.inv
                }
            }

        case getType(InvoiceDetAction.handleCloseErr):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        
        case getType(InvoiceDetAction.warnDue):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }

        default:
            return state
    }
}

export { invDetReducer as InvoiceDetReducer }