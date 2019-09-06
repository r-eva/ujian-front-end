import React from 'react';
import ReactDOM from 'react-dom';
import ReduxThunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import Reducers from './redux/2.reducers'
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const globalStore = createStore(Reducers, {}, applyMiddleware(ReduxThunk))

ReactDOM.render(<Provider store={globalStore}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
