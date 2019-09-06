import React, {Component} from 'react';
import './Auth.css'
import {onLogin, onRegister} from './../../redux/1.actions'
import {connect} from 'react-redux'
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'

let cookieObj = new Cookie()

class Auth extends Component {
    state = {
        loginUsername: '',
        loginPassword: ''
    }

    componentWillReceiveProps(newProps) {
        cookieObj.set('userData', newProps.username, {path: '/'})
    }

    onLoginBtnHandler = () => {
        this.props.onLogin({asalNama: this.state.loginUsername, asalKunci: this.state.loginPassword})
    }

    render() {
        if (this.props.username !== '') {
            return <Redirect to="/" exact/>
        }
        return (
            <div className="container auth">
                <div className="row justify-content-center">
                    <div className="col-3 text-center auth-left">
                        <h3>Welcome!</h3>
                        <p>Belanja anti ribet di Popokpedia, mari bergabung bersama kami!</p>
                    </div>
                    <div className="col-9 auth-right text-center pb-5">
                        <div className="container-fluid">
                            <h3
                                className="pb-3"
                                style={{
                                color: '#495057',
                                marginTop: '8%'
                            }}>Login Now!</h3>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Username"
                                            onChange={(e) => this.setState({loginUsername: e.target.value})}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={(e) => this.setState({loginPassword: e.target.value})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                {
                                        this.props.isLoading == true
                                        ?
                                        <div class="spinner-border text-danger" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                        :
                                        <input
                                        type="button"
                                        className="btn float-right btn-register"
                                        value="Login"
                                        onClick={this.onLoginBtnHandler}/>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.user.loading,
        message: state.user.msg,
        username: state.user.username,
        id: state.user.id
    }
}

export default connect(mapStateToProps, {onLogin})(Auth);