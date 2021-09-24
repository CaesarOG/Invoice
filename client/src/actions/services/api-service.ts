import { EditInvoiceState } from '../../reducers/EditInvoiceReducer'
import { Res, PostOptions, Login, Register, invListSucc, invListReq, User, GetOptions,
    Invoice, editcr8Succ, getFormSucc, editcr8Req } from './models'

var postOptions = new PostOptions()
var getOptions = new GetOptions()
const serverURL = "http://54.226.241.160:9990" // "http://localhost:9990"

const handleResponse = (res: Response): Promise<{[x:string]: any}|string> => {
    return new Promise( (resolve: (data: {[x: string]: any}|string | PromiseLike<{[x: string]: any}|string>) => void, reject: (err: Res) => void) => {
        res.json().then( (resp: Res) => {
            if(resp.status !== true) {
                reject(resp)
            }
            resolve(resp.data)
        })
        .catch(r => { 
            reject({message: r.stack, status: false, data: {}}) 
        });
    });
}

const handleNoResponse = (err: Res|Error): Res => {
    // return new Promise( ( reject/*: (err: sXcRes) => void*/) => { Useless to add bcos no async or internal promise
        return ({status: false, message: err.message, data: {}})
    // })
}

const auth = {
    login: (email: string, password: string): Promise<Login> => {
        postOptions.body = JSON.stringify({email, password})
        console.log(postOptions.body)
        return new Promise( (resolve: (value: Login | PromiseLike<Login>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/auth/login`, postOptions)
            .then( response => {
                console.log(response)
                return handleResponse(response).then( data => {
                    resolve(data as Login)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        })
    }, 

    register: ( {firstName, lastName, email, password, role}: {[x:string]: any}): Promise<Register> => {
        postOptions.body = JSON.stringify({firstName, lastName, email, password, role})
        return new Promise( (resolve: (value: Register | PromiseLike<Register>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/auth/register`, postOptions)
            .then( response => {
                console.log(response)
                return handleResponse(response).then( data => {
                    resolve(data as Register)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        })
    }

}

const invoice = {
    createinv: ({materials, materialsChecked, stringtoMats}: editcr8Req, edcr8Red: EditInvoiceState): Promise<editcr8Succ> => {
        let inv: Invoice = new Invoice()
        materialsChecked.forEach(m => inv.materials.push(materials[stringtoMats[m]]))
        let { name, description, billableHrs, wageRate, supplyCost, custEmails, custEmail, invoice } = edcr8Red
        inv.name = name; inv.description = description; inv.billableHrs = parseFloat(billableHrs.toString()); inv.wageRate = parseFloat(wageRate.toString());
        inv.supplyCost = parseFloat(supplyCost.toString()); inv.notes = invoice.notes; inv.custEmail = custEmail; inv.contrEmail = edcr8Red.user.email;
        inv.contrID = edcr8Red.user.ID
        custEmails.forEach(c => c.email === custEmail?inv.custID=c.id:null)
        postOptions.body = JSON.stringify(inv)
        return new Promise( (resolve: (value: editcr8Succ | PromiseLike<editcr8Succ>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/invc/create`, postOptions)
            .then( response => {
                console.log(response)
                return handleResponse(response).then( data => {
                    resolve(data as editcr8Succ)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        })
    },

    getmanyinvs: ({offset, limit, query, place}: invListReq, curPg: number, usr: User): Promise<invListSucc> => {
        return new Promise( (resolve: (value: invListSucc | PromiseLike<invListSucc>) => void, reject: (err: Res) => void) => {
            let pL = place as string
            if (query) {
                getOptions.headers = {'Offset': `${offset}`,'Limit': `${limit}`, 'Place': `${pL}`, 'Query': `${query}`}
            } else {
                getOptions.headers = {'Offset': `${offset}`,'Limit': `${limit}`, 'Place': `${pL}`}
            }
            if (usr.role === 'Admin') {
                getOptions.headers['Admin'] = "True"
            } else getOptions.headers['Role'] = usr.role
            fetch(`${serverURL}/api/invc/getmany/${usr.ID}`, getOptions)
            .then( response => {
                handleResponse(response).then( data => {
                    resolve(data as invListSucc)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        });
    },

    changelineitems: ({materials, materialsChecked, stringtoMats}: editcr8Req, edcr8Red: EditInvoiceState): Promise<editcr8Succ> => {
        return new Promise( (resolve: (value: editcr8Succ | PromiseLike<editcr8Succ>) => void, reject: (err: Res) => void) => {
            let { name, description, billableHrs, wageRate, supplyCost, invoice } = edcr8Red
            invoice.materials = []
            materialsChecked.forEach(m => invoice.materials.push(materials[stringtoMats[m]]))
            invoice.name = name; invoice.description = description; invoice.billableHrs = parseFloat(billableHrs.toString()); invoice.wageRate = parseFloat(wageRate.toString());
            invoice.supplyCost = parseFloat(supplyCost.toString());
            postOptions.body = JSON.stringify(invoice)
            fetch(`${serverURL}/api/invc/change/${invoice.ID!}`, postOptions)
            .then( response => {
                handleResponse(response).then( data => {
                    resolve(data as editcr8Succ)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        });
    },

    getformitems: (): Promise<getFormSucc> => {
        return new Promise( (resolve: (value: getFormSucc | PromiseLike<getFormSucc>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/invc/getformitems`)
            .then( response => {
                handleResponse(response).then( data => {
                    resolve(data as getFormSucc)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))

        });
    },

    getone: (id: string): Promise<{invoice: Invoice}> => {
        return new Promise( (resolve: (value: {invoice: Invoice} | PromiseLike<{invoice: Invoice}>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/invc/get/${id}`)
            .then( response => {
                handleResponse(response).then( data => {
                    resolve(data as {invoice: Invoice})
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))

        });
    }


}

export default {
    auth,
    invoice
}

//used braces to nest the response.json so catch of top-then is syntactically outside. so have to return response.json() 
//as there are braces. no curlies so only one line, then no explicit return

/**
 * ```javascript
 * return fetch (`${serverURL}/api/buildoauth`, postOptions)
 * .then( response => {
 *     return handleResponse(response)
 *     .then( (data) => {
 *         // return new Promise( (resolve: (value: BuildOauth | PromiseLike<BuildOauth>) => void) => {
 *             return(data as BuildOauth)
 *         // })
 *     })
 *     .catch(handleNoResponse)
 * })
 * .catch(handleNoResponse)
 * 
 * //THIS ABOVE BAD MODEL RETURN FETCH CHANGES TYPE OF PROMISE TO UNION WITH THEN & CATCH, AND THEN INSTEAD OF THE 
 * //from().pipe(map(), catchError()) IN EPICS THAT IS ALLOWED BY THE MODEL I FIGURED OUT USED IN THIS FILE, HAVE 
 * //TO USE FOLLOWING INSIDE the pipe in from(...).pipe() 
 *         
 * mergeMap<BuildOauth|sXcRes, sourceSuccOb|sourceFailOb>(
 *     (dataOrErr: BuildOauth|sXcRes) => {
 *        if( (dataOrErr as BuildOauth).source ) {
 *             let data = dataOrErr as BuildOauth
 *             return of ( sourceUrl.success({source: data.source, url: data.url}))
 *         } else {
 *             let err = dataOrErr as sXcRes
 *             return of ( sourceUrl.failure({error: err.message, errOpen: true}) )
 *         } 
 *     } 
 * ) 
 * ```
 */