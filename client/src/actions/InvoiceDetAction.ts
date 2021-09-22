import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, Invoice, getInvModel } from './services/models'

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
                    return of( getInvoice.success({user: action.payload.user, inv: data.invoice, id: action.payload.id}) )
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
    (inv: Invoice) => {
        return { inv }
    }
)()








const invoiceDetActions = {
    editcr8,
    getInvoice
}

export { invoiceDetActions as InvoiceDetAction }