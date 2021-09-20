import { Res, PostOptions, Login, Register, invListSucc, Notification, invListReq, User, GetOptions, FrgnField, Invoice, editcr8Succ, getFormSucc } from './models'
import services from './index';

var postOptions = new PostOptions()
var getOptions = new GetOptions()
const serverURL = "https://stagingapp.startupxchange.com" // "http://localhost:9990"

const handleResponse = (res: Response): Promise<{[x:string]: any}|string> => {
    return new Promise( (resolve: (data: {[x: string]: any}|string | PromiseLike<{[x: string]: any}|string>) => void, reject: (err: Res) => void) => {
        res.json().then( (resp: Res) => {
            if(resp.status !== true) {
                reject(resp)
            }
            resolve(resp.data)
        });
    });
}

const handleNoResponse = (err: Res|Error): Res => {
    // return new Promise( ( reject/*: (err: sXcRes) => void*/) => {
        return ({status: false, message: err.message, data: {}})
    // })
}

const auth = {
    //DONE change all these promises to be the data after handleResponse parses sXcRes
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

    register: ( {firstName, lastName, email, password}: {[x:string]: any}): Promise<Register> => {
        postOptions.body = JSON.stringify({firstName, lastName, email, password})
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
    createinv: (inv: Invoice): Promise<editcr8Succ> => {
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

    getmanyinvs: ({offset, limit, query, place}: invListReq, curPg: number, id: string): Promise<invListSucc> => {
        return new Promise( (resolve: (value: invListSucc | PromiseLike<invListSucc>) => void, reject: (err: Res) => void) => {
            let pL = place as string
            if (query) {
                getOptions.headers = {'Offset': `${offset}`,'Limit': `${limit}`, 'Place': `${pL}`, 'Query': `${query}`}
            } else {
                getOptions.headers = {'Offset': `${offset}`,'Limit': `${limit}`, 'Place': `${pL}`}
            }
            fetch(`${serverURL}/api/invc/getmany/${id}`, getOptions)
            .then( response => {
                handleResponse(response).then( data => {
                    resolve(data as invListSucc)
                })
                .catch(err => reject(handleNoResponse(err)))
            })
            .catch(err => reject(handleNoResponse(err)))
        });
    },

    changelineitems: (inv: Invoice, id: string): Promise<editcr8Succ> => {
        return new Promise( (resolve: (value: editcr8Succ | PromiseLike<editcr8Succ>) => void, reject: (err: Res) => void) => {
            fetch(`${serverURL}/api/invc/change/${id}`, getOptions)
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