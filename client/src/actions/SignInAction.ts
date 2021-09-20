import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { HeaderAction } from '.'
import { Res, signReq, epicErr, signSucc, Login, FrgnField } from './services/models'

const doSign = createAsyncAction(
    '@@signin/SIGNIN_REQUEST',
    '@@signin/SIGNIN_SUCCESS',
    '@@signin/SIGNIN_FAILURE'
)<signReq, signSucc, epicErr>();
//type founderorfunderFail = ActionType<typeof founderorfunder.failure>; type founderorfunderSuc = ActionType<typeof founderorfunder.success>; 
//destructure param deep ({payload: {industriesChecked, statesChecked, funder}}: {payload: updFunderReq}) => {}
export const signin: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(doSign.request)), 
    switchMap( action => {
        let { email, password } = action.payload as signReq
        if(email === "" || password === "") {
            return of ( doSign.failure({error: 'Email Or Password Was Blank.', errOpen: true}))
        }
        return from(api.auth.login(action.payload.email, action.payload.password)).pipe(
            mergeMap(
                (data: Login) => {
                    localStorage.saveItem('user', data.user)
                    localStorage.saveItem('token', data.token)
                        return of ( HeaderAction.setSignedIn(data.user), doSign.success({ 
                            email: "", password: "", user: data.user
                        }) )

                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of( doSign.failure({error: err.message, errOpen: true}) )
                }
            )
        )

    })
) 

const handleChange = createAction('@@signin/PROP_CHANGE',
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        return { propName: name, propValue: value}
    }
)()

const handleCloseErr = createAction('@@signin/CLOSE_ERR_SNACKBAR',
    (e: any, reason?: string) => {
        if(reason === 'clickaway') {
            return { errOpen: false, error: "" }
        } else {
            return { errOpen: false, error: "" }
        }
    } 
)() //React.SyntheticEvent<HTMLElement, Event> might be needed, or React.MouseEvent<any, Event> or some shit

const toSignUp = createAction('@@signin/TO_SIGN_UP',
    () => {
        return { email: "", password: "" }
    }
)()

const isFounder = (roles: FrgnField[]):boolean => {
    for (let i = 0; i < roles.length; i++) {
      if(roles[i].payload === 'Founder') {
        return true
      }
    }
    return false
}


const signinActions = {
    doSign,
    handleChange,
    handleCloseErr,
    toSignUp
};

export default signinActions