import React, { Component } from 'react';
import { Table } from 'reactstrap';
import {urlApi} from '../../3.helpers/database'
import Axios from 'axios'
import {connect} from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Redirect} from 'react-router-dom'
import { Alert } from 'reactstrap'
import {Link} from 'react-router-dom'

class History extends Component {

    state = {
        semuaHistory: [],
        detailProduct: [],
        keluarModal: false,
        modalMode: false,
        visible: true
    }

    componentDidMount() {
            this.getDataHistory(this.props.userId)
    }

    componentWillReceiveProps(newProps) {
            this.getDataHistory(newProps.userId)
    }

    getDataHistory = (userId) => {
        Axios.get(urlApi + `history?userId=` + userId)
            .then((res)=>{
                this.setState({semuaHistory: res.data})
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderHistory = () => {
        var jsx = this.state.semuaHistory.map((val, idx) => {
            return (
                <tr className="text-center">
                    <td>{idx + 1 }</td>
                    <td>{val.transactionDate}</td>
                    <td>{val.totalBelanjaan}</td>              
                    <td>{val.alamatPenerima}</td>
                    <td><input type="button" className="btn btn-info btn-block" value="DETAIL" onClick={() => this.setState({detailProduct: val, keluarModal: true, modalMode: true})}/></td>
                </tr>
            )
        })
        return jsx
    }

    fungsiKeluarinDetail = () => {
        return (
                <Modal isOpen={this.state.modalMode}>
                    <ModalHeader>
                        <h6 className="font font-weight-bold">Berikut Detail Transaksi Anda</h6>
                    </ModalHeader>
                    <ModalBody className="justify-content-center">
                        1. Tanggal Transaksi: {this.state.detailProduct.transactionDate} <br/>
                        <br/>
                        2. Pengiriman <br/>
                        Nama Penerima: {this.state.detailProduct.namaPenerima} <br/>
                        Alamat Pengiriman: {this.state.detailProduct.alamatPenerima} <br/>
                        Kode Pos: {this.state.detailProduct.kodePosPenerima} <br/>
                        <br/>
                        3. Produk Yang Dibeli <br/>
                            <table dark>
                                <thead>
                                    <tr className="text-left">
                                        <th>Nama Produk</th>
                                        <th>Discount</th>
                                        <th>Harga</th>
                                        <th>Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.loopingCart()}
                                    <br/>
                                </tbody>
                                <tfoot>
                                    Total Belanja: {this.state.detailProduct.totalBelanjaan}
                                </tfoot>
                            </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({modalMode: false, keluarModal: false})}>OK</Button>
                    </ModalFooter>
                </Modal>
        )
    }

    loopingCart = () => {
        var jsx = this.state.detailProduct.cart.map(val => {
            return (
                <tr>
                    <td>{val.productName}</td>
                    <td>{val.discount}%</td> 
                    <td>{val.price}</td>              
                    <td>{val.quantity}</td>
                </tr>
            )
        })
        return jsx
    }

    render() {
        if (this.props.userId == 0){
            return <Redirect to="/" exact />
        } else if (this.state.semuaHistory.length == 0) {
            return (
                <div>
                    <div className="container mt-5">
                    <Alert color="danger">
                        Your History is empty, Let's <Link to='/' style={{color: 'green', textDecoration: 'underline'}}>Go Shopping </Link>
                    </Alert>
                    </div>
                </div>
            )
        }
        return (
            <div className="container mt-5">
                <Table striped>
                    <thead className='text-center'>
                        <tr>
                            <th>#</th>
                            <th>WAKTU TRANSAKSI</th>
                            <th>TOTAL BELANJA</th>
                            <th>ALAMAT PENGIRIMAN</th>
                            <th>DETAIL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderHistory()}
                    </tbody>
                </Table>
                <div>
                    {
                        this.state.keluarModal == true
                        ?
                        <>
                            {this.fungsiKeluarinDetail()}
                        </>
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

    export default connect(mapStateToProps)(History)

