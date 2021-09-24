import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError, debounce } from 'rxjs/operators'
import { from, of, interval } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, invListReq, invListSucc, User } from './services/models'



const getManyInvoices = createAsyncAction(
    '@@invoiceshome/INVS_GETMANY_REQUEST',
    '@@invoiceshome/INVS_GETMANY_SUCCESS',
    '@@invoiceshome/INVS_GETMANY_FAILURE'
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

const createInv = createAction('@@invoiceshome/CR8_INV',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user: User) => (
        {edcr8: "Create", user}
    )
)()

const setUser = createAction('@@invoiceshome/SET_USER',
    (user: User) => (
        {user}
    )
)()


const invClickRow = createAction('@@invoiceshome/CLICK_FOUND',
    (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }, user: User) => (
        {rowData, rowMeta, user }
    )
)()

const updSearchTxt = createAction('@@invoiceshome/SEARCH_CHANGE',
    (searchText: string) => (
        {searchText}
    )
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

const InvoicesHomeActions = {
    invClickRow,
    getManyInvoices,
    updSearchTxt,
    setUser,
    createInv,
    handleCloseErr
}

export { InvoicesHomeActions as InvoicesHomeAction }