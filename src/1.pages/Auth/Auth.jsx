import React, {Component} from 'react';
import './Auth.css'
// 1. Import action itu sendiri
import {onLogin, onRegister} from './../../redux/1.actions'
// 2. Import connect dari react-redux
import {connect} from 'react-redux'
import Cookie from 'universal-cookie'
import {Redirect} from 'react-router-dom'
import swal from 'sweetalert';

let cookieObj = new Cookie()

class Auth extends Component {
    state = {
        registerUsername: '',
        registerPassword: '',
        repeatPassword: '',
        registerEmail: '',
        loginUsername: '',
        loginPassword: '',
        isSame: true,
        emailFormat: true
    }

    componentWillReceiveProps(newProps) {
        cookieObj.set('userData', newProps.username, {path: '/'})
    }

    onLoginBtnHandler = () => {
        this.props.onLogin({asalNama: this.state.loginUsername, asalKunci: this.state.loginPassword})
    }

    onRegisterBtnHandler = () => {
        this.setState({isSame: true})
        this.setState({emailFormat: true})
        if (this.state.repeatPassword == '' || this.state.registerPassword == '' || this.state.registerEmail == '' || this.state.repeatPassword == '') {
            swal ('Could not be Submitted', 'Mohon lengkapi data Anda', 'error')
        } else if (this.state.repeatPassword !== this.state.registerPassword) {
            this.setState({isSame: false})
        } else if (/@/.test(this.state.registerEmail) == false) {
            this.setState({emailFormat: false})
        } else if (this.state.registerEmail && this.state.registerPassword && this.state.repeatPassword && this.state.isSame == true && this.state.emailFormat == true) {
            let registerObj = {
                username: this.state.registerUsername,
                password: this.state.registerPassword,
                email: this.state.registerEmail
            }
            this.props.onRegister(registerObj)
        }
    }


    passwordChecker = () => {
        if (!this.state.isSame) {
            return (
                <h6 className="alert alert-danger">Password belom sama</h6>
            )
        }
    }
    emailChecker = () => {
        if (!this.state.emailFormat) {
            return (
                <h6 className="alert alert-danger">Invalid Email</h6>
            )
        }
    }

    render() {
        if (this.props.username !== '') {
            return <Redirect to="/" exact/>
        }
        return (
            <div className="container auth">
                <div className="row">
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
                            }}>Register Now!</h3>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            ref='registerUsername'
                                            onChange={(e) => this.setState({registerUsername: e.target.value})}
                                            className="form-control"
                                            placeholder="Username"/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            ref="registerEmail"
                                            onChange={(e) => this.setState({registerEmail: e.target.value})}
                                            className="form-control"
                                            placeholder="Email"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            ref='registerPassword'
                                            onChange={(e) => this.setState({registerPassword: e.target.value})}
                                            className="form-control"
                                            placeholder="Password"/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            ref="repeatPassword"
                                            onChange={(e) => this.setState({repeatPassword: e.target.value})}
                                            className="form-control"
                                            placeholder="Repeat Password"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    {this.passwordChecker()}
                                    {this.emailChecker()}
                                    {
                                        this.props.message !== ''
                                        ?
                                        <h6 className="alert alert-danger">{this.props.message}</h6>
                                        :
                                        null
                                    }
                                </div>
                                <div className="col-4">
                                    {!this.props.isLoading
                                        ? <input
                                                type="button"
                                                onClick={this.onRegisterBtnHandler}
                                                ref="btnLogin"
                                                className="btn float-right btn-register"
                                                value="Register"/>
                                        : <div className="spinner-border text-primary">
                                            <span className="sr-only">Loading...</span>
                                            </div>
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

export default connect(mapStateToProps, {onLogin, onRegister})(Auth);