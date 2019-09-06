import React, { Component, isValidElement } from 'react';
import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'

class BestSellingProduct extends Component {

    state = {
        allHistory: []
    }

    componentDidMount() {
        this.getdataApi()
        this.pendapatanToko()
    }

    getdataApi = () => {
        Axios.get(urlApi + 'history/')
        .then((res) => {
            this.setState({allHistory: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
       
    }

    pendapatanToko = () => {
        var temp = 0
        var jsx = this.state.allHistory.map(val => {
            return temp += val.totalBelanjaan
        })
        return temp
    }

    render() {
        return (  
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header border-0 pt-5">
                                <h3>Total Income</h3>
                            </div>
                            <div className="card-body">
                                Total pendapatan dari user belanja adalah Rp. {this.pendapatanToko()}
                            </div>
                            <div className="card-footer">
                                Pendapatan dihitung dari {this.state.allHistory.length} transaksi yang berhasil.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BestSellingProduct;