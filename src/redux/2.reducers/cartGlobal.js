const INITIAL_STATE = {jumlahCart: 0}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'HITUNG_CART':
            return {...state, jumlahCart: action.cartYangDitambah}
        default:
            return state
    }
}