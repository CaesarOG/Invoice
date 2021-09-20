import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import { Res, epicErr, Register, regSucc } from './services/models'
import { SignUpAction } from './index'

const doReg = createAsyncAction(
    '@@register/REGISTER_REQUEST',
    '@@register/REGISTER_SUCCESS',
    '@@register/REGISTER_FAILURE'
)<undefined, regSucc, epicErr>();
//type sourceUrlFail = ActionType<typeof sourceUrl.failure>; type sourceUrlSucc = ActionType<typeof sourceUrl.success>;

export const register: Epic<RootAction, RootAction, RootState, Services> = (
action$, state$, 
{ logger, localStorage, api }
) => 
action$.pipe(
    filter(isActionOf(doReg.request)), 
    switchMap( (action: any) => { //i wish I could  any to register.request and destructure action.payload here https://stackoverflow.com/questions/38946387/cast-function-parameter-type-in-typescript
        let { firstName, lastName, email, password, confirmPassword } = state$.value.RegisterReducer
        if(email === "" || password === "") {
            return of ( doReg.failure({error: 'Email Or Password Was Blank.', errOpen: true}))
        }
        if(password !== confirmPassword) {
            return of ( doReg.failure({error: 'Confirm Password And Password Do Not Match.', errOpen: true}))
        }
        return from(api.auth.register({firstName, lastName, email, password})).pipe(
            mergeMap(
                (data: Register) => {
                    localStorage.saveItem('user', data.user)
                    localStorage.saveItem('token', data.token)
                    return of( doReg.success({firstName: "", lastName: "", email: "", password: "", confirmPassword: ""}), SignUpAction.secondActiveStep() )
                }
            ),
            catchError(
                (err: Res) => {
                    logger.log(err);
                    return of( doReg.failure({error: err.message, errOpen: true}) )
                }
            )
        )

    })
) 

const handleChange = createAction('@@register/PROP_CHANGE',
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        return { propName: name, propValue: value}
    }
)()

const handleChangeRadio = createAction('@@founderfunder/RADIO_CHANGE',
    (e: React.ChangeEvent<{}>, value: string) => {
        return { angelOrFirm: value }
    } 
)();

const handleChangeSwitch = createAction('@@founderfunder/SWITCH_CHANGE',
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = e.target //might need checked instead of value
        return { switchName: id, switchValue: checked }
    }
)()

const handleCloseErr = createAction('@@register/CLOSE_ERR_SNACKBAR',
    (e: any, reason?: string) => {
        if(reason === 'clickaway') {
            return { errOpen: false, error: "" }
        } else {
            return { errOpen: false, error: "" }
        }
    } 
)(); //React.SyntheticEvent<HTMLElement, Event> might be needed, or React.MouseEvent<any, Event> or some shit

const backSignIn = createAction('@@register/TO_SIGN_IN',
    () => {
        return { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }
    }
)()


const registerActions = {
    doReg,
    handleChange,
    handleCloseErr,
    handleChangeSwitch,
    backSignIn
};

export default registerActions