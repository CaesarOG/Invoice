import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError, debounce } from 'rxjs/operators'
import { from, of, interval } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, invListReq, invListSucc, User } from './services/models'



const getManyInvoices = createAsyncAction(
    '@@invoiceslist/INVS_GETMANY_REQUEST',
    '@@invoiceslist/INVS_GETMANY_SUCCESS',
    '@@invoiceslist/INVS_GETMANY_FAILURE'
)<invListReq & {user: User}, invListSucc & {user: User}, epicErr>();
//type codeTokenFail = ActionType<typeof codeToken.failure>; type codeTokenSucc = ActionType<typeof codeToken.success>;

export const invList: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(getManyInvoices.request)), 
    debounce(()=> interval(1000)),
    switchMap( action => 
        from(api.invoice.getmanyinvs(action.payload, state$.value.InvoicesHomeReducer.currentPage, action.payload.user)).pipe(
            mergeMap( /*<BuildOauth, Observable<sourceUrlSucc>>*/
                (data: invListSucc) => {
                    logger.log(data.pagination);
                    return of( getManyInvoices.success({...data, user: action.payload.user}))
                }
            ),
            catchError( /*<sXcRes, Observable<sourceUrlFail>>*/
                (err: Res) => {
                    logger.log(err);
                    return of ( getManyInvoices.failure({error: err.message, errOpen: true}) )
                } 
            )
        ),
    )
)


const invClickRow = createAction('@@founderslist/CLICK_FOUND',
    (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }, user) => (
        {rowData, rowMeta, user}
    )
)()


const updSearchTxt = createAction('@@masterlists/SEARCH_CHANGE',
    (searchText: string) => (
        {searchText}
    )
)()


const InvoicesHomeActions = {
    invClickRow,
    getManyInvoices,
    updSearchTxt
}

export { InvoicesHomeActions as InvoicesHomeAction }