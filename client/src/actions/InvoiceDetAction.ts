import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, Invoice, getInvModel, User } from './services/models'

const getInvoice = createAsyncAction(
    '@@invoicedet/GET_INV_REQUEST',
    '@@invoicedet/GET_INV_SUCCESS',
    '@@invoicedet/GET_INV_FAILURE'
)<getInvModel, getInvModel, epicErr>(); 
//type founderorfunderFail = ActionType<typeof founderorfunder.failure>; type founderorfunderSuc = ActionType<typeof founderorfunder.success>;

export const getInv: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(getInvoice.request)), 
    switchMap( action => 
        from(api.invoice.getone(action.payload.id!)).pipe(
            mergeMap(
                (data: {invoice: Invoice}) => {
                    data.invoice.dueDate = new Date(data.invoice.dueDate)
                    let now: Date = new Date()
                    if (data.invoice.dueDate < now) {
                        return of( warnDue(), getInvoice.success({user: action.payload.user, inv: data.invoice, id: action.payload.id}) )
                    } else {
                        return of( getInvoice.success({user: action.payload.user, inv: data.invoice, id: action.payload.id}) )
                    }

                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of( getInvoice.failure({error: err.message, errOpen: true}) )
                }
            )
        )
    )
)

const editcr8 = createAction('@@invoicedet/TO_EDITCR8',
    (inv: Invoice, usr: User) => {
        return { inv, usr }
    }
)()

const warnDue = createAction('@@invoicedet/WARN_DUE',
    () => (
        {error: "This invoice is due!", errOpen: true}
    )
)()

const setInv = createAction('@@invoicedet/SET_INV',
    (inv: Invoice, id: string, usr: User) => {
        let now: Date = new Date()
        if (inv.dueDate < now) {
            return {inv, id, usr, error: "This invoice is due!", errOpen: true}
        } else {
            return {inv, id, usr}
        }
    }
)()

const handleCloseErr = createAction('@@invoicedet/CLOSE_ERR_SNACKBAR',
    (e: any, reason?: string) => {
        if(reason === 'clickaway') {
            return { errOpen: false, error: "" }
        } else {
            return { errOpen: false, error: "" }
        }
    } 
)()


const invoiceDetActions = {
    editcr8,
    getInvoice,
    setInv,
    handleCloseErr,
    warnDue
}

export { invoiceDetActions as InvoiceDetAction }