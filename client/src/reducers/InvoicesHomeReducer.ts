import { ActionType, getType } from 'typesafe-actions'
import { InvoicesHomeAction } from '../actions'
import { Reducer }  from 'redux'
import { Invoice, User } from '../actions/services/models';
import { history } from '../App'

export interface InvoicesHomeState {
    currentPage: number
    limit: number
    place: 'page'|'rows'|'search'|'sClose'
    count: number
    list: Array<Invoice>
    searchText: string
    error: string
    errOpen: boolean
    user: User
}

export const invHinitialState: InvoicesHomeState = {
    currentPage: 1, limit: 30, place: 'page', count: 1, list: [], searchText: '', error: "", errOpen: false, user: new User()
}

type InvoicesHomeAction = ActionType<typeof InvoicesHomeAction>;

const invHReducer: Reducer<InvoicesHomeState, InvoicesHomeAction> = (state: InvoicesHomeState = invHinitialState, action: InvoicesHomeAction): InvoicesHomeState => {

    switch(action.type) {

        case getType(InvoicesHomeAction.createInv):
            setTimeout(() => history.push(`/editcr8`, {edcr8: action.payload.edcr8, user: action.payload.user}), 100)
            return state

        
        case getType(InvoicesHomeAction.getManyInvoices.failure):
            return {
                ...state, ...(action.payload)
            }
        
        case getType(InvoicesHomeAction.setUser):
            return {
                ...state, user: action.payload.user
            }

        case getType(InvoicesHomeAction.invClickRow):
            let inv: Invoice = state.list[action.payload.rowMeta.dataIndex]
            inv.dueDate = new Date(inv.dueDate)
            setTimeout(() => history.push(`/detail/${action.payload.rowData[0]}`, {inv, user: action.payload.user}), 100)
            return state

        case getType(InvoicesHomeAction.getManyInvoices.success):
            let {offset, count, limit, place} = action.payload.pagination
            if(place === "page") {
                return {
                    ...state, list: state.list.concat(action.payload.invoices), limit, place, count: count!, currentPage: offset/limit, user: action.payload.user
                }
            }
            else if(place === "rows" || place === "sClose") {
                return {
                    ...state, list: action.payload.invoices, limit, place, count: count!, currentPage: place==="sClose"?1:offset/limit
                }
            }
            else if(place === "search") {
                return {
                    ...state, list: action.payload.invoices, limit, place, count: count!, currentPage: offset/limit
                }
            }

            return {
                ...state
            }

        case getType(InvoicesHomeAction.handleCloseErr):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        
            
        default: 
            return state

    }
}

export default invHReducer
