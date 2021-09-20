import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, invListReq, invListSucc } from './services/models'
import services from '../actions/services'



const getManyInvoices = createAsyncAction(
    '@@invoiceslist/INVS_GETMANY_REQUEST',
    '@@invoiceslist/INVS_GETMANY_SUCCESS',
    '@@invoiceslist/INVS_GETMANY_FAILURE'
)<invListReq, invListSucc, epicErr>();
//type codeTokenFail = ActionType<typeof codeToken.failure>; type codeTokenSucc = ActionType<typeof codeToken.success>;

export const invList: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(getManyInvoices.request)), 
    switchMap( action => 
        from(api.invoice.getmanyinvs(action.payload, state$.value.InvoicesHomeReducer.currentPage)).pipe(
            mergeMap( /*<BuildOauth, Observable<sourceUrlSucc>>*/
                (data: invListSucc) => {
                    logger.log(data.pagination);
                    return of( getManyInvoices.success(data))
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
    (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }) => (
        {rowData}
    )
)()


const updSearchTxt = createAction('@@masterlists/SEARCH_CHANGE',
    (searchText: string) => (
        {searchText}
    )
)()


const handleChangeSelect = createAction('@@companyntfn/SELECT_CHANGE',
    (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const {name, value} = e.target //might need checked instead of value
        return { selectName: name as string, selectValue: value as string }
    }
)()


const InvoicesHomeActions = {
    invClickRow,
    getManyInvoices,
    updSearchTxt
}

export { InvoicesHomeActions as InvoicesHomeAction }