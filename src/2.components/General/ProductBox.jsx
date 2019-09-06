import React from 'react';
import './style.css';
import {Link} from 'react-router-dom'
import Axios from 'axios'
import {urlApi} from '../../3.helpers/database'
import swal from 'sweetalert'
import {connect} from 'react-redux'
import {hitungCart} from '../../redux/1.actions'

const ProductBox = (props) => {

    const addToCart = () => {
        let cartObj = {
            productId: props.id,
            userId: props.userId,
            quantity: Number(1),
            price: props.harga,
            img: props.img,
            discount: props.discount,
            productName: props.nama
        }

        Axios.get(urlApi + `cart?userId=${props.userId}&productId=${cartObj.productId}`)
       .then((res)=>{
           if (res.data.length > 0) {
               cartObj.quantity = parseInt(res.data[0].quantity) + parseInt(cartObj.quantity)
               Axios.put(urlApi + 'cart/' + res.data[0].id, cartObj )
               .then((res) => {
                   swal('Add to cart', 'Item added to cart', 'success')
               })
               .catch((err)=>{
                   console.log(err)
               })
           } else {
               Axios.post(urlApi + 'cart', cartObj)
               .then ((res) => {
                swal ('Add to cart', 'Item added to cart', 'success')
                props.hitungCart(props.userId)
               })
               .catch((err) => {
                   console.log(err)
               })    
           }
        })
       .catch((err)=>{
           console.log(err)
        })
    }

    return (
        <div className="card col-md-3 m-3" style={{width:'18rem'}}>
            <Link to={'product-details/' + props.id}><img className="card-img-top img" height='200px' src={props.img} alt="Card" /></Link>
            {
                props.discount > 0
                ?
                <div className="discount">{props.discount}%</div>
                :
                null
            }
            <div className="card-body">
                <h4 className="card-text">{props.nama}</h4>
                {
                    props.discount > 0
                    ?
                    <p style={{textDecoration : 'line-through', color:'red'}}>Rp. {new Intl.NumberFormat('id-ID').format(props.harga)}</p>
                    :
                    null
                }
                <p className="card-text">Rp. {new Intl.NumberFormat('id-ID').format(props.harga - (props.harga * (props.discount/100)))}</p>
            </div>
            <div className="card-footer" style={{backgroundColor:'inherit'}}>
                {
                    props.userId == '0' || props.userId == '1'
                    ?
                    <>
                        {
                            props.userId == '1'
                            ?
                            <>
                                <Link to='/admin/dashboard'><input type='button' className='d-block btn btn-success btn-block' value='ADMIN DASHBOARD'/></Link>
                            </>
                            :
                            <>
                                <Link to='/Login'><input type='button' className='d-block btn btn-success btn-block' value='Add To Cart'/></Link>
                            </>
                        }
                    </>                    
                    :
                    <input type='button' className='d-block btn btn-success btn-block' value='Add To Cart' onClick={() => addToCart()}/>
                }
            </div>
        </div>
    );
};


export default connect(null, {hitungCart})(ProductBox);