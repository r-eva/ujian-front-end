import {combineReducers} from 'redux'
import userGlobal from './userGlobal';
import cartGlobal from './cartGlobal'


export default combineReducers({
    user : userGlobal,
    cart : cartGlobal
})