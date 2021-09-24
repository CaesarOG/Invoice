import { ActionType, getType } from 'typesafe-actions'
import { HeaderAction, SideBarAction, AppAction } from '../actions'
import { Reducer } from 'redux'
import { history } from '../App'
import { User, Notification } from '../actions/services/models'

export interface HeaderState {
    isSearchOpen: boolean
    isMailsUnread: boolean
    isNotificationsUnread: boolean
    signedIn: boolean
    notificationsMenu: any
    profileMenu: any
    user: User,
    ntfnModalOpen: {[x:string]: boolean}
    error: string
    errOpen: boolean
    notifications: Notification[]
    dues: boolean
}

export const hDinitialState: HeaderState = {
    isSearchOpen: false, isMailsUnread: false, isNotificationsUnread: false, notificationsMenu: null, 
    profileMenu: null, signedIn: false, user: new User(), notifications: [],
    ntfnModalOpen: {"FundNtfn": false, "CmpyReturn": false}, error: "", errOpen: false, dues: false
}

type HeaderAction = ActionType<typeof HeaderAction>;

const hDReducer: Reducer<HeaderState, HeaderAction> = (state: HeaderState = hDinitialState, action: HeaderAction): HeaderState => {
    switch(action.type) {

        case getType(HeaderAction.goHome):
            setTimeout(() => { history.push('/') }, 100)
            return state

        case getType(HeaderAction.logout):
            setTimeout(() => { history.replace('/signin') }, 100);
            return {
                ...state, signedIn: action.payload.signedIn
            }
            
        case getType(HeaderAction.setUserSigned):
            return {
                ...state, signedIn: action.payload.signedIn, user: action.payload.user
            }
        
        case getType(HeaderAction.custNotifs):

            setTimeout(() => { console.log('') }, 100);
            if (action.payload.role === 'Customer') {
                return {
                    ...state, notifications: action.payload.notifs, dues: action.payload.notifs.length !== 0 ? true:false
                }
            } else {
                return state
            }

        case getType(HeaderAction.goInvoice):
            history.push(`/detail/${action.payload.notif.ID}`)
            return {
                ...state
            }
        
        case getType(HeaderAction.openNotifsMenu):
            return {
                ...state, notificationsMenu: action.payload.notificationsMenu, isNotificationsUnread: action.payload.isNotificationsUnread
            }
        
        case getType(HeaderAction.closeNotificationsMenu):
            return {
                ...state, notificationsMenu: action.payload.notificationsMenu
            }

        case getType(HeaderAction.openProfileMenu):
            return {
                ...state, profileMenu: action.payload.profileMenu
            }

        case getType(HeaderAction.closeProfileMenu):
            return {
                ...state, profileMenu: action.payload.profileMenu
            }

        case getType(HeaderAction.toggleSearch):
            return {
                ...state, isSearchOpen: !state.isSearchOpen
            }

        case getType(HeaderAction.closeDialog):
            return {
                ...state, dues: false
            }

        default: 
            return state

    }
}

export { hDReducer as HeaderReducer }



export interface SideBarState {
    isPermanent: boolean
}


export const sBinitialState: SideBarState = {
    isPermanent: true
}

type SideBarAction = ActionType<typeof SideBarAction>;

const sBReducer: Reducer<SideBarState, SideBarAction> = (state: SideBarState = sBinitialState, action: SideBarAction): SideBarState => {
    switch(action.type) {
        
        case getType(SideBarAction.handleWindowWidthChange):
            return {
                ...state, isPermanent: !state.isPermanent
            }
        
        default: 
            return state

    }
}

export { sBReducer as SideBarReducer }



export interface AppState {
    isSidebarOpened: boolean
  }
  export const appInitialState: AppState = {
    isSidebarOpened: false
  }
  
type AppAction = ActionType<typeof AppAction>;
  
  const appReducer: Reducer<AppState, AppAction> = (state: AppState = appInitialState, action: AppAction): AppState => {
    switch(action.type) {
        
        case getType(AppAction.toggleSidebar):
            return {
                ...state, isSidebarOpened: !state.isSidebarOpened
            }
        
        default: 
            return state
  
    }
  }
  
export { appReducer as AppReducer }
