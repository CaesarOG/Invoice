import { createAction, createAsyncAction, isActionOf } from 'typesafe-actions'
import { Theme } from '@material-ui/core';
import { Epic } from 'redux-observable'
import { switchMap, mergeMap, filter, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {RootAction, RootState, Services } from 'MyTypes'
import services from './services'
import { User, Notification, epicErr, Res, obj, Invoice } from './services/models'


const handleWindowWidthChange = createAction('@@sidebar/HANDLE_WINDOW_WIDTH',
    (isPermanent: boolean, theme: Theme) => {
        const windowWidth = window.innerWidth;
        const breakpointWidth = theme.breakpoints.values.md;
        const isSmallScreen = windowWidth < breakpointWidth;

        if (isSmallScreen && isPermanent) {
            return { isPermanent: false }
        } else if (!isSmallScreen && !isPermanent) { 
            return { isPermanent: true }
        }
        else return {isPermanent: false }

    }
)()

const goHome = createAction('@@header/GO_HOME',
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => ({})
)()

const logout = createAction('@@header/LOGOUT',
    () => {

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('founder')
        localStorage.removeItem('funder')
        localStorage.removeItem('statesChecked')
        localStorage.removeItem('industriesChecked')
        localStorage.removeItem('fundRngsChecked')

        return { signedIn: false };
    }
)()

const setSignedIn = createAction('@@header/SIGNED_IN',
    (usr?: User) => {
        const user = usr?usr:services.localStorage.loadItem<User>('user')
        
        const signedIn = Boolean(user)
        const now = new Date()

        let notifs: Invoice[] = []
        user.invoices.forEach(inv => inv.due < now && user.role == "Customer"?notifs.push(inv):null)
        return { signedIn, user, notifs }
    }
)()

const toggleSearch = createAction('@@header/TOGGLE_SEARCH',
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (
        {}
    )
)()

const openNotificationsMenu = createAction('@@header/OPEN_NOTIF_MENU',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (
        { notificationsMenu: e.currentTarget, isNotificationsUnread: false }
    )
)()

const closeNotificationsMenu = createAction('@@header/NOTIF_MENU_CLOSE',
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => ( 
        { notificationsMenu: null }
    )
)()

const clickCmpyNtfns = createAction('@@header/CLICK_CMPY_NTFNS',
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>, cmpyNtfns: Array<Notification>) => (
        { cmpyNtfns }
    )
)()

const clickFundNtfn = createAction('@@header/CLICK_FUND_NTFN',
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>, ntfn: Notification) => (
        { ntfn }
    )
)()

const cmpyReturnNtfn = createAction('@@header/CMPY_RETURN_NTFN',
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>, ntfn: Notification) => (
        { ntfn }
    )
)()

const openProfileMenu = createAction('@@header/OPEN_PROFILE_MENU',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (
        { profileMenu: e.currentTarget }
    )
)()

const closeProfileMenu = createAction('@@header/PROFILE_MENU_CLOSE',
    (event: {}, reason: "backdropClick" | "escapeKeyDown") => (
        { profileMenu: null }
    )
)()

const closeDialog = createAction('@@header/CLOSE_DIALOG',
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, ntfnType: string) => (
        {ntfnType}
    )
)()

const handleChangeSingleSel = createAction('@@header/SINGLE_SEL_CHANGE',
    (e: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
        const {name, value} = e.target //might need checked instead of value
        return { selectName: name!, selectValue: value as string}
    }
)()

const handleCloseErr = createAction('@@header/CLOSE_ERR_SNACKBAR',
    (e: any, reason?: string) => {
        if(reason === 'clickaway') {
            return { errOpen: false, error: "" }
        } else {
            return { errOpen: false, error: "" }
        }
    } 
)();

const toggleSidebar = createAction('@@app/TOGGLE_SIDEBAR',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        return {}
    }
)()

const sidebarActions = {
    handleWindowWidthChange
}

export { sidebarActions as SideBarAction }

const headerActions = {
    logout,
    goHome,
    openNotificationsMenu,
    closeNotificationsMenu,
    clickCmpyNtfns,
    clickFundNtfn,
    cmpyReturnNtfn,
    openProfileMenu,
    closeProfileMenu,
    toggleSearch, setSignedIn,
    handleChangeSingleSel,
    closeDialog, handleCloseErr
}

export { headerActions as HeaderAction }

const appActions = { 
    toggleSidebar 
}

export { appActions as AppAction }
