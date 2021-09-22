import { createAction } from 'typesafe-actions'
import { Theme } from '@material-ui/core';
import services from './services'
import { User, Notification } from './services/models'
import React from 'react';


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

const setUserSigned = createAction('@@header/SET_SIGNED_IN',
    (usr: User) => {
        const user = usr?usr:services.localStorage.loadItem<User>('user')
        const signedIn = Boolean(user)
        const now = new Date()

        let notifs: Notification[] = []
        if (user.role === 'Customer' && user.custInvoices && user.custInvoices.length > 0) {
            user.custInvoices.forEach(inv => inv.due < now ? notifs.push({message: 'Invoice '+inv.name+' is due!'}):null)
        }
        

        return {notifs, user, signedIn}
    }
)()

const toggleSearch = createAction('@@header/TOGGLE_SEARCH',
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (
        {}
    )
)()


const openNotifsMenu = createAction('@@header/OPEN_NOTIF_MENU',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => 
        ({ notificationsMenu: e.currentTarget, isNotificationsUnread: false })
)()

const closeNotificationsMenu = createAction('@@header/NOTIF_MENU_CLOSE',
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => ( 
        { notificationsMenu: null }
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
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (
        {}
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

const goInvoice = createAction('@@header/GO_INVOICE',
    (e: any, notif: Notification) => {
        return {notif}
    })()

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
    openNotifsMenu,
    closeNotificationsMenu,
    goInvoice,
    openProfileMenu,
    closeProfileMenu,
    toggleSearch, setUserSigned,
    handleChangeSingleSel,
    closeDialog, handleCloseErr
}

export { headerActions as HeaderAction }

const appActions = { 
    toggleSidebar 
}

export { appActions as AppAction }
