import React, { Component } from 'react';
import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import {connect} from 'react-redux'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {hitungCart} from '../../redux/1.actions'
import { Alert } from 'reactstrap'
import {Link} from 'react-router-dom'

class Cart extends Component {
    state = {
        cart: [],
        timeOutClick: true,
        dayCheckOut: '',
        keluarModal: 0,
        paymentMode: false,
        inputUang: '',
        kembalianUang: null,
        submitModal: true,
        namaPenerima: '',
        alamatPenerima: '',
        kodePosPenerima: ''
    }

    componentDidMount() {
        this.getDataApi(this.props.userId)
    }

    componentDidUpdate() {
        this.props.hitungCart(this.props.userId)
    }

    componentWillReceiveProps(newProps) {
        this.getDataApi(newProps.userId)
    }

    getDataApi = (userId) => {
        Axios.get(urlApi + `cart?userId=` + userId)
        .then((res)=>{
            this.setState({cart: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    deleteCart = (index) => {
        Axios.delete(urlApi + 'cart/' + index) 
        .then((res)=> {
            this.getDataApi(this.props.userId)
            swal ('Delete item', 'Item deleted from cart', 'success')
        })
        
        .catch((err) => {
            console.log(err)
        })
    }

    renderCart = () => {
        var jsx = this.state.cart.map((val, idx) => {
            return (
                <tr className="text-center">
                    <td>{val.productName}</td>
                    <td>{val.price}</td>
                    <td>{val.discount}%</td>              
                    <td>
                        <input type="button" className="btn btn-secondary" onClick={()=> this.onBtnEditQty('add', idx)} value='+'/>
                        <input type="button" className="btn btn-secondary" value={val.quantity}/>
                        <input type="button" className="btn btn-secondary" onClick={()=> this.onBtnEditQty('min', idx)} value='-'/>
                    </td>
                    <td>{val.quantity * (val.price - (val.price * (val.discount / 100)))}</td>
                    <td><input type="button" className="btn btn-danger btn-block" value="DELETE" onClick={()=> this.deleteCart(val.id)}/></td>
                </tr>
            )

        })
        return jsx
    }

    onBtnEditQty = (action, index) => {
        let arrCart = this.state.cart
        if (action == 'min') {
            if(arrCart[index].quantity > 1) {
                arrCart[index].quantity -= 1
                Axios.put(urlApi + 'cart/' + arrCart[index].id, arrCart[index])
                .then((res) => {
                    this.getDataApi(this.props.userId)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        } else if (action == 'add') {
            arrCart[index].quantity += 1
            Axios.put(urlApi + 'cart/' + arrCart[index].id, arrCart[index])
            .then((res) => {
                this.getDataApi(this.props.userId)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    totalBelanjaan = () => {
        var hargaTotal = 0
        this.state.cart.map(val => {
            return hargaTotal += val.quantity * (val.price - (val.price * (val.discount / 100)))
        })
        return hargaTotal
    }

    prosesUang = () => {
        if (this.totalBelanjaan() - Number(this.state.inputUang) > 0) {
            var tempKembalianUang = this.totalBelanjaan() - Number(this.state.inputUang)
            return this.setState({kembalianUang: tempKembalianUang})
        } else if (this.totalBelanjaan() - Number(this.state.inputUang) < 0) {
            var tempKembalianUang = this.totalBelanjaan() - Number(this.state.inputUang)
            this.setState({kembalianUang: tempKembalianUang})
            return this.setState({submitModal: false})
        } else {
            this.setState({kembalianUang: 0})
            return this.setState({submitModal: false})
        }
    }

    resetDanSubmitHistory = () => {
        this.setState({inputUang: '', kembalianUang: null, submitModal: true})
        var date = new Date()
        var tanggalTransaksi = `${new Intl.DateTimeFormat('en-GB').format(date)} ${date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}` 
        var postingHistory = {
            transactionDate: tanggalTransaksi,
            userId: this.props.userId,
            totalBelanjaan: this.totalBelanjaan(),
            namaPenerima: this.state.namaPenerima,
            alamatPenerima: this.state.alamatPenerima,
            kodePosPenerima: this.state.kodePosPenerima,
            cart: this.state.cart
        }
        Axios.post(urlApi + 'history', postingHistory)
        .then((res) => {
            //console.log(res.data)
        })
        .catch((err) => {
            swal ('Eror', 'Servernya Mati Bro', 'error')
        })

        for (var i = 0; i < this.state.cart.length; i++) {
            Axios.delete(urlApi + 'cart/'+ this.state.cart[i].id)
            .then((res) => {
                console.log(res)
                swal ('Terima kasih telah berbelanja!', 'Barang anda akan dikirim ke tempat tujuan.', 'success')
            })
            .catch((err) => {
                swal ('Eror', 'Nggak dapat data yang mau didelete bro', 'error')
            })
        }
        
        this.props.hitungCart(this.props.userId)
        
        return this.setState({cart: [],
            timeOutClick: true,
            dayCheckOut: '',
            keluarModal: 0,
            paymentMode: false,
            inputUang: '',
            kembalianUang: null,
            submitModal: true})
    }

    render() {
        if (this.props.userId == 0){
            return <Redirect to="/" exact />
        } else if (this.state.cart.length == 0) {
            return (
                <div className="container mt-5">
                    <Alert color="danger">
                        Your Cart is empty, Let's <Link to='/' style={{color: 'green', textDecoration: 'underline'}}>Go Shopping </Link>
                    </Alert>
                </div>
            )
        }
        return (
            <div className='container'>
                <table className='table mt-3'>
                    <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.renderCart()}
                    </tbody>
                </table>
                <div className="row">
                        <div className="col-12 text-center">
                            {
                                this.state.cart.length == 0
                                ?
                                null
                                :
                                <>
                                <h5 className="font-weight-bold">TOTAL BELANJAAN ANDA: Rp. {this.totalBelanjaan()}</h5>
                                    {
                                        this.state.timeOutClick == false
                                        ?
                                        <>
                                        <div><p className="font font-weight-bolder">Mohon selesaikan pembayaran anda paling lambat pada: <br/><span className="font-weight-bold" style={{color: 'red'}}>{this.state.dayCheckOut}</span></p></div>
                                        <div className='mb-5'>
                                            <input type="button" className="btn btn-success" value="BAYAR SEKARANG" onClick={() => this.setState({keluarModal: 1, paymentMode: true})}/>
                                        </div>
                                        </>
                                        :
                                        <input type="button" className="btn btn-warning" value="CHECKOUT" onClick={() =>{
                                        this.setState({
                                            timeOutClick: false,
                                            dayCheckOut: new Date (new Date().getTime() + 2*24*60*60*1000).toString()
                                        })
                                        }
                                    }/>
                                    }
                                </>
                            }
                        </div>
                        {
                            this.state.keluarModal == 1
                            ?
                            <div>
                                <Modal isOpen={this.state.paymentMode}>
                                    <ModalHeader>
                                        <h6 className="font font-weight-bold">SILAKAN MASUKKAN DATA ANDA</h6>
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="row mb-3">
                                            <div className="col-6 m-0">
                                                <input type="text" placeholder="Masukkan Penerima" onChange={(e) => this.setState({namaPenerima: e.target.value})}/><br/>
                                            </div>
                                            <div className="col-6 m-0">
                                                <input type="text" placeholder="Masukkan Alamat" onChange={(e) => this.setState({alamatPenerima: e.target.value})}/><br/>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-6 m-0">
                                                <input type="text" placeholder="Masukkan Kode Pos" onChange={(e) => this.setState({kodePosPenerima: e.target.value})}/><br/>
                                            </div>
                                        </div>
                                        
                                        <h6 className="font font-weight-bold">SILAKAN MASUKKAN UANG ANDA</h6>
                                        Rp. <input type="number" placeholder="Masukkan Nominal" onChange={(e) => this.setState({inputUang: e.target.value})}/> <br/><br/>
                                        {
                                            this.state.kembalianUang == null
                                            ?
                                            null
                                            :
                                            <>
                                            {
                                                this.state.kembalianUang > 0
                                                ?
                                                <h6>Uang anda kurang Rp. {this.state.kembalianUang}. Mohon input kembali!</h6>
                                                :
                                                <>
                                                {
                                                    this.state.kembalianUang == 0
                                                    ?
                                                    <h6>Uang Anda Pas.</h6>
                                                    :
                                                    <h6>Kembalian Anda Rp. {Math.abs(this.state.kembalianUang)}.</h6>
                                                }
                                                </>
                                            }
                                            </>
                                        }
                                    </ModalBody>
                                    <ModalFooter>
                                        {
                                            this.state.submitModal == true
                                            ?
                                            <>
                                            <Button color="success" onClick={this.prosesUang}>SUBMIT</Button>
                                            <Button color="secondary" onClick={() => this.setState({paymentMode: false, inputUang: '', kembalianUang: null, submitModal: true})}>CANCEL</Button>
                                            </>
                                            :
                                            <>
                                            {
                                                this.state.namaPenerima == '' || this.state.alamatPenerima == '' || this.state.kodePosPenerima == ''
                                                ?
                                                <>
                                                  <p style={{color: "red"}}>Mohon Lengkapi Dulu Data Pengiriman</p>  
                                                </>
                                                :
                                                <Button color="success" onClick={this.resetDanSubmitHistory}>OK</Button>
                                            }
                                            </>
                                        }
                                        
                                    </ModalFooter>
                                </Modal>
                            </div>
                            :
                            null
                        }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id
    }
}

export default connect(mapStateToProps, {hitungCart})(Cart);
