import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import swal from 'sweetalert'

export const onLogin = (userObject) => {
    return (dispatch) => {
        dispatch({
            type : 'IS_LOADING'
        })

        if (userObject.asalNama == '' || userObject.asalKunci == '') {
            dispatch({
                type : 'BERHENTI_LOADING'
            })
            swal({icon: "warning", text: "Mohon lengkapi data username dan password."})
        } else {
            Axios.get(urlApi + 'users', {
                params : {
                    username : userObject.asalNama,
                    password : userObject.asalKunci
                }
            })
            .then((res) => {
                console.log(res)
                if(res.data.length > 0){
                    dispatch({
                        type : 'LOGIN_SUCCESS',
                        payload : {
                            a : res.data[0].username,
                            b : res.data[0].role,
                            c : res.data[0].id
                        }
                    })
                } else {
                    dispatch({
                        type : 'BERHENTI_LOADING'
                    })
                    swal ('Eror', 'Username atau Password Salah', 'error')
                }
            })
            .catch((err) => {
                console.log(err)
                dispatch({
                    type : 'BERHENTI_LOADING'
                })
                swal('System Error', 'A problem has occured, please contact an administrator', 'error')
            })
        }
       
    }
}

export const onRegister = (userObject) => {
    return (dispatch) => {
        dispatch({
            type : 'IS_LOADING'
        })
        dispatch({
            type : 'CLEAR_MSG'
        })
        
        Axios.get(urlApi + 'users', {
            params : {
                username : userObject.username
            }
        })
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'USERNAME_UDAH_ADA',
                    hasil : 'MOHON INPUT USERNAME YANG LAIN'
                })
            } else {
                userObject.role = 'user'
                Axios.post(urlApi + 'users', userObject)
                .then((res) => {
                    dispatch({
                        type : 'LOGIN_SUCCESS',
                        payload : {
                            a : res.data.username,
                            b : res.data.role,
                            c : res.data.id
                        }
                    })
                    swal('Success', 'Registration Succesful!', 'success')
                })
                .catch((err) => {
                    console.log(err)
                    dispatch({
                        type : 'BERHENTI_LOADING'
                    })
                    swal('System Error', 'A problem has occured, please contact an administrator', 'error')
                })
            }
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type : 'BERHENTI_LOADING'
            })
            swal('System Error', 'A problem has occured, please contact an administrator', 'error')
        })
    }
}

export const keepLogin = (cookieData) => {
    return (dispatch) => {
        Axios.get(urlApi + 'users', {
            params : {
                username : cookieData
            }
        })
        .then((res) => {
            dispatch({
                type : 'KEEP_LOGIN',
                payload : {
                    username : res.data[0].username,
                    role : res.data[0].role,
                    id : res.data[0].id
                }
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

export const resetUser = () => {
    return (dispatch) => {
        dispatch({
            type : 'RESET_USER'
        })
    }
}

export const showingId = () => {
    return (dispatch) => {
        dispatch({
            type: 'TAMPILIN_USERKOSONG'
        })
    }
}

export const cookieChecker = () => {
    return (dispatch) => {
        dispatch({
            type: 'COOKIE_CHECK'
        })
    }
}

export const hitungCart = (id) => {
    return (dispatch) => {
        Axios.get(urlApi + `cart?userId=` + id)
        .then((res) => {
            dispatch({
                type: 'HITUNG_CART',
                cartYangDitambah: res.data.length
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}