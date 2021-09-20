import { ActionType, getType } from 'typesafe-actions'
import { InvoicesHomeAction } from '../actions'
import { Reducer }  from 'redux'
import { Invoice } from '../actions/services/models';
import services from '../actions/services'
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
}

export const invHinitialState: InvoicesHomeState = {
    currentPage: 1, limit: 30, place: 'page', count: 1, list: [], searchText: '', error: "", errOpen: false
}

type InvoicesHomeAction = ActionType<typeof InvoicesHomeAction>;

const invHReducer: Reducer<InvoicesHomeState, InvoicesHomeAction> = (state: InvoicesHomeState = invHinitialState, action: InvoicesHomeAction): InvoicesHomeState => {

    switch(action.type) {

        case getType(InvoicesHomeAction.getManyInvoices.failure):
            return {
                ...state, 
            }

        case getType(InvoicesHomeAction.getManyInvoices.failure):
            return {
                ...state, error: action.payload.error, errOpen: action.payload.errOpen
            }
        
        case getType(InvoicesHomeAction.invClickRow):
        history.push(`/detail/${action.payload.rowData[0]}`)
        return state

        case getType(InvoicesHomeAction.getManyInvoices.success):
            let {offset, count, limit, place} = action.payload.pagination
            if(place === "page") {
                return {
                    ...state, list: state.list.concat(action.payload.invoices), limit, place, count: count!, currentPage: offset/limit
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

        case getType(InvoicesHomeAction.updSearchTxt):
            return {
                ...state, searchText: action.payload.searchText
            }
        
            
        default: 
            return state

    }
}

export default invHReducer
