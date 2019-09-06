import React, { Component } from 'react';
import Axios from 'axios';
import { urlApi } from '../../3.helpers/database';

class Wishlist extends Component {

    render() {
        return (
            <div>
                <h1 className='text-center mt-5'>Wishlist</h1>
                <table>
                    <thead>
                        <tr className="text-center">
                            <td>No.</td>
                            <td>Item Name</td>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        );
    }
}

export default Wishlist;