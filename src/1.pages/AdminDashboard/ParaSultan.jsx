import React, { Component } from 'react';
import Axios from 'axios'
import { urlApi } from '../../3.helpers/database';
import {Table} from 'reactstrap'

class ParaSultan extends Component {
    state = {
        data : [],
        dataUser: [],
        belanjaanTertinggi: '',
        userIdPemenang: '',
        userNamePemenang: ''
    }

    componentDidMount() {
        this.getDataUser()
        this.getdataApi()
    }

    getDataUser = () => {
        Axios.get(urlApi + 'users/')
        .then((res) => {
            this.setState({data: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getdataApi = () => {
        Axios.get(urlApi + 'history/')
        .then((res) => {
            this.setState({data: res.data})

                var tempDataUserYangBelanja = []
                this.state.data.map(val => {
                    return tempDataUserYangBelanja.push(val.userId)
                })

                var tempdaftarTotalBelanjaan = []
                this.state.data.map(val => {
                    return tempdaftarTotalBelanjaan.push(val.totalBelanjaan)
                })

                var hasil = tempDataUserYangBelanja[tempdaftarTotalBelanjaan.indexOf((Math.max(...tempdaftarTotalBelanjaan)))]
    
                this.setState({belanjaanTertinggi: Math.max(...tempdaftarTotalBelanjaan)})

                var tempDataUser = []
                this.state.dataUser.map(val => {
                    return tempDataUser.push(val.username)
                })

            this.setState({userIdPemenang: hasil})

            Axios.get(urlApi + 'users/'+ this.state.userIdPemenang)
            .then((res) => {
                this.setState({userNamePemenang: res.data.username})
            })
            .catch((err) => {
                console.log(err)
            })

        })
        .catch((err) => {
            console.log(err)
        })
    }

    getNamaUser = () => {
        var hasil = ''
        this.state.dataUser.map( val => {
            if (this.state.userIdPemenang == val.id) {
                return hasil = val.username
            }
        })
        return hasil
    }

    render() {
        return (
            <div className="container mt-5 mb-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 pt-5 text-center">
                                <h1>PARA SULTAN POKPOKPEDIA</h1>
                            </div>
                            <div className="container card-body">
                                {
                                    this.state.userIdPemenang == ''
                                    ?
                                    null
                                    :
                                    <>
                                    User Tersultan adalah : {this.state.userNamePemenang} <br/>
                                    Total belanjaan tertingginya adalah: Rp. {this.state.belanjaanTertinggi} <br/>
                                    </>
                                }
                            </div>
                            <div className="card-footer align-items-center">
                            Ayo kalahkan <span className="font-weight-bold" style={{color: 'blue'}}>{this.state.userNamePemenang}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParaSultan;