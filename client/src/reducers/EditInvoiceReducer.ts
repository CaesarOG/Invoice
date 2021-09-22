import { ActionType, getType } from 'typesafe-actions'
import { EditInvoiceAction } from '../actions'
import { Reducer }  from 'redux'
import { FrgnField, Invoice, User } from '../actions/services/models';
import { history } from '../App'

export interface EditInvoiceState {
    name: string
    description: string
    billableHrs: number
    wageRate: number
    supplyCost: number
    status: string
    materials: FrgnField[]
    custEmails: string[]
    notes: FrgnField[]
    materialsChecked: string[]
    editOrCreate: string
    error: string
    errOpen: boolean
    note: {message?: string}
    user: User
    stringtoMats: {[x:string]: any}
    custEmail: string
    invoice: Invoice
    id?: string
}

export const editInvinitialState: EditInvoiceState = {
    name: "", description: "", billableHrs: 0.5, wageRate: 0.0, supplyCost: 0.0, status: 'Ready', materials: [], notes: [], materialsChecked: [],
    editOrCreate: "Create", error: "", errOpen: false, note: {message: ""}, user: new User(), custEmails: [], stringtoMats: {}, custEmail: "",
    invoice: {name: '', description: '', billableHrs: 0.0, wageRate: 0.0, supplyCost: 0.0, status: '', 
    materials: [], notes: [], due: new Date(), custEmail: "", contrEmail: ""}
}

type EditInvoiceAction = ActionType<typeof EditInvoiceAction>;

const editInvReducer: Reducer<EditInvoiceState, EditInvoiceAction> = (state: EditInvoiceState = editInvinitialState, action: EditInvoiceAction): EditInvoiceState => {
    switch(action.type) {

        case getType(EditInvoiceAction.editOrCreateInv.failure):
            console.log("failure "+action.payload.error)
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }
        
        case getType(EditInvoiceAction.addNote):
            let notes = state.invoice!.notes
            notes.push(action.payload.n)
            return {
                ...state, invoice: {...state.invoice, notes}
            }

        case getType(EditInvoiceAction.editOrCreateInv.success):
            setTimeout(() => history.push('/', {...(action.payload), user: state.user}), 100)
            return {
                ...state
            }

        case getType(EditInvoiceAction.getFormItems.success):
            return {
                ...state, ...(action.payload), editOrCreate: action.payload.edCr8
            }

        case getType(EditInvoiceAction.getFormItems.failure):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }

        case getType(EditInvoiceAction.handleChangeSwitch):
            return {
                ...state, [action.payload.switchName]: action.payload.switchValue
            }

        case getType(EditInvoiceAction.handleChangeSingleSel):
            return {
                ...state, [action.payload.selectName]: action.payload.selectValue
            }

        case getType(EditInvoiceAction.handleChangeSelect):
            return {
                ...state, [action.payload.selectName]: action.payload.selectValue
            }
        
 //https://www.codementor.io/junedlanja/copy-javascript-object-right-way-ohppc777d
//https://stackoverflow.com/questions/36031590/right-way-to-update-state-in-redux-reducers //https://jsfiddle.net/pahund/5qtt2Len/1/, https://stackoverflow.com/questions/30626070/shallow-clone-an-es6-map-or-set
//https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
 //https://stackoverflow.com/questions/8206988/clone-copy-a-map-instance

        case getType(EditInvoiceAction.handleChange):
            return {
                ...state, [action.payload.propName]: action.payload.propValue
            }
                    
        case getType(EditInvoiceAction.handleCloseErr):
            return {
                ...state, errOpen: action.payload.errOpen, error: action.payload.error
            }


        default: 
            return state
            
    }
}

export default editInvReducer