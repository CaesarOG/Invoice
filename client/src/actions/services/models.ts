export interface FrgnField { payload?: string, name?: string, message?: string }
export interface Notification { message?: string };

export interface Invoice {
    name: string
    description: string
    billableHrs: number
    wageRate: number
    supplyCost: number
    status: string
    materials: FrgnField[]
    notes: FrgnField[]
    due: Date

}

interface IUser {
    ID: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    fullName: () => string
    role?: string
    invoices: Invoice[]
}

export class User implements IUser {
     
    constructor(public ID: string="", public firstName: string="", public lastName: string="", public phone: string="",
        public email: string="", public password: string="", public role?: string, public invoices: Invoice[]=[]) {}
    
    public fullName(): string  { //using 'get' converts to property invoked implicitly not callable
        return `${this.firstName} ${this.lastName}`
    }
}



/*------RESPONSES-------------------------------------------------------------------------------------------------------------------------------------------*/
export interface Res {
    status: boolean
    message: string
    data: {[x: string]: any} //type for any Object
};

export interface Register { user: User, token: string } //response

export interface Login extends Register {

};

/*------EPIC-ACTIONS----------------------------------------------------------------------------------------------------------------------------------------*/
export type signReq = {email: string, password: string}; export type signSucc = {user: User, email: string, password: string};
export type regSucc = {firstName: string, lastName: string, email: string, password: string, confirmPassword: string}; 

export type editcr8Req = {invoice: Invoice, editOrCr8: string, id?: string}
export type editcr8Succ = {invoice: Invoice}

export type getformSucc = {materials: FrgnField[]}


type Pagination = { offset: number, limit: number, count?: number, place: place };
export type place = 'page'|'rows'|'search'|'sClose';
export type invListReq = Pagination & { query?: string};
export type invListSucc = { pagination: Pagination } & {invoices: Invoice[]}; 
export type epicErr = {error: string, errOpen: boolean};

/*------MISCELLANEOUS----------------------------------------------------------------------------------------------------------------------------------------*/
export type obj = {[x:string]: any};
export class PostOptions {
    method: string = 'POST'
    headers: {[x: string]: string} = {'Content-Type': 'application/json'}
    body: string = JSON.stringify({})
}
export class GetOptions {
    method: string = 'GET'
    headers: {[x:string]: string} = {}
}

export const createPropsGetter = <DP extends object>(defaultProps: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Pick<P, Exclude<keyof P, keyof DP>>

        type RecomposedProps = DP & PropsExcludingDefaults

        return (props as any) as RecomposedProps
    }
}