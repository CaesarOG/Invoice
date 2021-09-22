import { ActionType, getType } from 'typesafe-actions'
import { InvoiceDetAction } from '../actions'
import { Reducer }  from 'redux'
import { history } from '../App'
import { Invoice, User } from '../actions/services/models'

export interface InvoiceDetState {
    invoice: Invoice
    user: User
    id: string
}
 
export const invcDetInitialState: InvoiceDetState = {
    invoice: {name: '', description: '', billableHrs: 0.0, wageRate: 0.0, supplyCost: 0.0, status: '', 
    materials: [], notes: [], due: new Date(), custEmail: "", contrEmail: ""}, user: new User(), id: ""
}

type InvoiceDetAction = ActionType<typeof InvoiceDetAction>;

const invDetReducer: Reducer<InvoiceDetState, InvoiceDetAction> = (state: InvoiceDetState = invcDetInitialState, action: InvoiceDetAction): InvoiceDetState => {
    switch(action.type) {
        case getType(InvoiceDetAction.editcr8):
            history.push(`/editcr8/${action.payload.inv.ID}`)
            return state        
            
        case getType(InvoiceDetAction.getInvoice.success):
            return {
                ...state, ...(action.payload), invoice: action.payload.inv!
            }
        case getType(InvoiceDetAction.getInvoice.failure):
            return {
                ...state, ...(action.payload)
            }
        default:
            return state
    }
}

export { invDetReducer as InvoiceDetReducer }