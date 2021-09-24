import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, Invoice, editcr8Req, editcr8Succ, getFormSucc, User } from './services/models'




const editOrCreateInv = createAsyncAction(
    '@@editcr8inv/INV_EDITCR8_REQ',
    '@@editcr8inv/INV_EDITCR8_SUCCESS',
    '@@editcr8inv/INV_EDITCR8_FAILURE'
)<editcr8Req, editcr8Succ, epicErr>();
//type codeTokenFail = ActionType<typeof codeToken.failure>; type codeTokenSucc = ActionType<typeof codeToken.success>;

export const edOrCr8Inv: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(editOrCreateInv.request)), 
    switchMap( action => 
        action.payload.editOrCr8==='Create'?from( api.invoice.createinv(action.payload, state$.value.EditInvoiceReducer) ).pipe(
            mergeMap(
                (data: editcr8Succ) => {
                    return of( editOrCreateInv.success(data))
                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of ( editOrCreateInv.failure({error: err.message, errOpen: true}) )
                } 
            )
        ):
        from( api.invoice.changelineitems(action.payload, state$.value.EditInvoiceReducer) ).pipe(
            mergeMap(
                (data: editcr8Succ) => {
                    return of( editOrCreateInv.success(data))
                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of ( editOrCreateInv.failure({error: err.message, errOpen: true}) )
                } 
            )
        ),
    )
    
)


const handleChange = createAction('@@editcr8inv/PROP_CHANGE',
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        return { propName: name, propValue: value}
    }
)()

const handleChangeSwitch = createAction('@@editcr8inv/SWITCH_CHANGE',
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = e.target //might need checked instead of value
        return { switchName: id, switchValue: checked }
    }
)()

const handleChangeSingleSel = createAction('@@editcr8inv/SINGLE_SEL_CHANGE',
    (e: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
        const {name, value} = e.target //might need checked instead of value
        return { selectName: name!, selectValue: value as string}
    }
)()

const handleChangeSelect = createAction('@@editcr8inv/SELECT_CHANGE',
    (e: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
        const {name, value} = e.target //might need checked instead of value
        return { selectName: name!, selectValue: value as unknown as string[]}
    }
)()

const handleCloseErr = createAction('@@editcr8inv/CLOSE_ERR_SNACKBAR',
    (e: any, reason?: string) => {
        if(reason === 'clickaway') {
            return { errOpen: false, error: "" }
        } else {
            return { errOpen: false, error: "" }
        }
    } 
)()

const addNote = createAction('@@editcr8inv/ADD_NOTE',
    (n: string) => ({n})
)()

const setInv = createAction('@@editcr8inv/SET_INV',
    (inv: Invoice, usr: User, edCr8: string) => {
        if(edCr8 === "Edit") {
            let vals: {name: string, description: string, billableHrs: number, wageRate: number, 
                supplyCost: number} = {...inv}
            let materialsChecked: string[] = []
            inv.materials.forEach(m => materialsChecked.push(m.name!))
            return {inv, usr, edCr8, vals, materialsChecked}
        } 
        else { 
            return {inv, usr, edCr8}
        }
    }
)()


const getFormItems = createAsyncAction(
    '@@editcr8inv/FORM_ITEMS_REQUEST',
    '@@editcr8inv/FORM_ITEMS_SUCCESS',
    '@@editcr8inv/FORM_ITEMS_FAILURE'
)<{inv?: Invoice, id?: string, edCr8: string}, getFormSucc, epicErr>(); 
//type founderorfunderFail = ActionType<typeof founderorfunder.failure>; type founderorfunderSuc = ActionType<typeof founderorfunder.success>;

export const formItems: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(getFormItems.request)), 
    switchMap( action => 
        from(api.invoice.getformitems()).pipe(
            mergeMap(
                (data: getFormSucc) => {
                    let stringtoMats: {[x:string]: any} = {}
                    data.materials.forEach((m, i) => stringtoMats[m.name!] = i)
                    return of( getFormItems.success({...data, stringtoMats, edCr8: action.payload.edCr8}) )
                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of( getFormItems.failure({error: err.message, errOpen: true}) )
                }
            )
        )
    )
)


const editInvActions = {
    handleChange,
    handleCloseErr,
    handleChangeSwitch,
    handleChangeSelect,
    handleChangeSingleSel,
    editOrCreateInv,
    getFormItems,
    addNote,
    setInv
};

export default editInvActions