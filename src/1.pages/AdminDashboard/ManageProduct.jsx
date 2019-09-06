import React, { Component } from 'react';
import swal from 'sweetalert';
import {urlApi} from '../../3.helpers/database' 
import Axios from 'axios';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Table } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AdminDashoard extends Component {
    state = {
        productData: [],
        inputName: '',
        inputPrice: '',
        inputDiscount: '',
        inputCategory: '',  
        inputDescription: '',
        inputImg: '',
        page: 0,
        pageContent: 3,
        editMode: false,
        editItem: null
    }

    componentDidMount() {
        this.getDataProduct()
    }

    getDataProduct = () => {
        Axios.get(urlApi + 'products')
        .then ((res) => {
            this.setState({productData: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderProducts = () => {
        let showData = this.state.productData.slice(this.state.page * this.state.pageContent, this.state.page * this.state.pageContent + this.state.pageContent)
        let jsx = showData.map((val) => {
            return (
                <tr>
                    <td>{val.nama}</td>
                    <td>{val.harga}</td>
                    <td>{val.discount}</td>
                    <td>{val.category}</td>
                    <td>{val.deskripsi}</td>
                    <td><img src={val.img} alt="gambar" width="80px"/></td>
                    <td><input type="button" className="btn btn-success" value="EDIT" onClick={() => this.setState({editMode: true, editItem: val})}/></td>
                    <td><input type="button" className="btn btn-danger" value="DELETE" onClick={() => this.onBtnDelete(val.id)}/></td>
                </tr>
            )
        })
        return jsx
    }

    onBtnAdd = () => {
        let produkBaru = {
            nama: this.state.inputName,
            harga: this.state.inputPrice,
            discount: this.state.inputDiscount,
            category: this.state.inputCategory,
            img: this.state.inputImg,
            deskripsi: this.state.inputDescription,
        }
        Axios.post(urlApi + 'products', produkBaru)
        .then((res) => {
            swal ('Success', 'Produk added','success')
            this.getDataProduct()
        })
        .catch((err) => {
            swal ('Eror', 'Servernya Mati Bro', 'error')
        })
    }

    onBtnSaveEdit = () => {
        let newItem = {
            id: this.state.editItem.id,
            nama: this.refs.editName.value ? this.refs.editName.value : this.state.editItem.nama,
            harga: this.refs.editPrice.value ? this.refs.editPrice.value : this.state.editItem.harga,
            category: this.refs.editCategory.value ? this.refs.editCategory.value : this.state.editItem.category,
            discount: this.refs.editDiscount.value ? this.refs.editDiscount.value : this.state.editItem.discount,
            deskripsi: this.refs.editDesc.value ? this.refs.editDesc.value : this.state.editItem.deskripsi,
            img: this.refs.editImg.value ? this.refs.editImg.value : this.state.editItem.img
        }
        Axios.put(urlApi + 'products/' + this.state.editItem.id, newItem)
        .then (res => {
            this.getDataProduct()
            swal ('Edit Success', 'Your item sudah diedit', 'success')
        })

        .catch (err => {
            console.log(err)
            swal ('Error', 'Ada masalah bro', 'eror')
        })

        this.setState({editMode: false, editItem: null})
    }

    onBtnDelete = (object) => {
        Axios.delete(urlApi + 'products/' + object) 
        .then((res)=> {
            this.getDataProduct()
            swal ('Delete item', 'Item deleted from list of product', 'success')
        })
        
        .catch((err) => {
            console.log(err)
        })
    }

    render() {
        if (this.props.adminLogin != 'admin')
        return <Redirect to="/" />
        
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 text-center">
                                <h3>MANAGE PRODUCT</h3>
                            </div>
                            <div className="card-body">
                                <Table dark className="table text-white text-center">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Category</  th>
                                            <th>Description</th>
                                            <th>Image Url</th>
                                            <th>Delete Product</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderProducts()}
                                    </tbody>
                                </Table>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        {
                                            this.state.page == 0
                                            ?
                                            <input type="button" className='disabled' value="<<Previous Page"/>
                                            :
                                            <input type="button" className='btn-secondary' value="<<Previous Page" onClick={() => this.setState({page: this.state.page - 1})}/>
                                        }
                                        {
                                            this.state.productData.length - ((this.state.page + 1) * this.state.pageContent) <= 0
                                            ?
                                            <input type="button" className='ml-2 disabled' value="Next Page>>"/>
                                            :
                                            <input type="button" className='btn-secondary ml-2' value="Next Page>>" onClick={() => this.setState({page: this.state.page + 1})}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3>Add Product</h3>
                            </div>
                            <div className="card-body">
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Product Name" onChange={(e)=> this.setState({inputName: e.target.value})}></input>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Price" onChange={(e)=> this.setState({inputPrice: parseInt(e.target.value)})}></input>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Discount" onChange={(e)=> this.setState({inputDiscount: parseInt(e.target.value)})}></input>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Category" onChange={(e)=> this.setState({inputCategory: e.target.value})}></input>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Description" onChange={(e)=> this.setState({inputDescription: e.target.value})}></input>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" placeholder="Image URL" onChange={(e)=> this.setState({inputImg: e.target.value})}></input>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <input type="button" className="btn btn-success btn-block" value="ADD" onClick={this.onBtnAdd}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                {
                    this.state.editItem == null 
                    ?
                    null
                    :
                    <Modal isOpen={this.state.editMode}>
                    <ModalHeader toggle={() => this.setState({editMode: false, editItem: null})}>
                        Edit {this.state.editItem.nama}
                    </ModalHeader>
                    <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <div className="row m-2">
                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <input type="text" ref="editName" className="form-control" placeholder={this.state.editItem.nama}></input>
                                        </div>
                                        <div className="col-4">
                                            <input type="text" ref="editPrice" className="form-control" placeholder={this.state.editItem.harga}></input>
                                        </div>
                                        <div className="col-4">
                                            <input type="text" ref="editDiscount" className="form-control" placeholder={this.state.editItem.discount}></input>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <input type="text" ref="editCategory" className="form-control" placeholder={this.state.editItem.category}></input>
                                        </div>
                                        <div className="col-4">
                                            <input type="text" ref="editDesc" className="form-control"placeholder={this.state.editItem.deskripsi}></input>
                                        </div>
                                        <div className="col-4">
                                            <input type="text" ref="editImg" className="form-control" placeholder={this.state.editItem.img}></input>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                    </ModalBody>
                    <ModalFooter>
                        <input type="button" className="btn btn-primary btn-block" value="SAVE" onClick={this.onBtnSaveEdit}></input>
                    </ModalFooter>
                    </Modal>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adminLogin: state.user.role
    }
}

export default connect(mapStateToProps)(AdminDashoard);