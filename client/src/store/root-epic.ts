import { combineEpics } from 'redux-observable'
import { makeFoF, handleChangeTicker, getF_o_underFormItems, handleChangeFirm, handleChangeCmpy, 
    clickSource, sendCode, gaaModalDone, getFounHome, vfsFounHome, doUpdateF, getFundHome, register, signin, cmpyList, firmList, founList, fundList,
    getCompany, vfsCmpyDet, getCmpyNtfn } from '../actions'

export default combineEpics(...Object.values({makeFoF, handleChangeTicker, getF_o_underFormItems, handleChangeFirm, handleChangeCmpy, 
    clickSource, sendCode, gaaModalDone, getFounHome, vfsFounHome, doUpdateF, getFundHome, register, signin, cmpyList, firmList, founList, fundList, 
    getCompany, vfsCmpyDet, getCmpyNtfn })) //if there was just one epic you'd wrap in ...Object.values() before combine