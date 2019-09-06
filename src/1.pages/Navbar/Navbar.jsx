import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookie from 'universal-cookie'
import { resetUser, hitungCart } from "./../../redux/1.actions"

let cookieObj = new Cookie()
class NavbarComp extends Component {

    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };
      }
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

    onBtnLogout = () => {
        cookieObj.remove('userId')
        cookieObj.remove('userData')
        this.props.resetUser()
    }

    componentDidUpdate() {
        this.props.hitungCart(this.props.userObj.id)
    }

    render() {        
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <Link to="/"><NavbarBrand>Popokpedia</NavbarBrand></Link>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {
                                this.props.userObj.username !== '' && this.props.userObj.role !== ''
                                ?
                                <>
                                    <NavItem>
                                        <NavLink>{this.props.userObj.showId ? this.props.userObj.id : null}</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink>{this.props.userObj.username}</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink>{this.props.userObj.role}</NavLink>
                                    </NavItem>
                                    {
                                        this.props.userObj.role == 'admin'
                                        ?
                                        null
                                        :
                                        <NavItem>
                                            <NavLink>CART {this.props.jumlahCart}</NavLink>
                                        </NavItem>
                                    }
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            Options
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                <Link to='/Wishlist'>Wishlist</Link>
                                            </DropdownItem>
                                            {
                                                this.props.userObj.role == 'admin'
                                                ?
                                                <Link to='/admin/dashboard'><DropdownItem>
                                                Admin Dashboard
                                                </DropdownItem></Link>
                                                :
                                                <>
                                                <Link to='/cart'><DropdownItem>
                                                    Cart
                                                </DropdownItem></Link>
                                                <Link to='/History'><DropdownItem>
                                                    History
                                                </DropdownItem></Link>
                                                </>
                                            }
                                            <DropdownItem divider />
                                            <DropdownItem onClick={this.onBtnLogout}>
                                                Logout
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                                :
                                <>
                                    <NavItem style={{borderRight : '1px solid lightgrey'}}>
                                        <Link to="/Login"><NavLink>Login</NavLink></Link>
                                    </NavItem>
                                    <NavItem>
                                        <Link to="/auth"><NavLink>Register</NavLink></Link>
                                    </NavItem>
                                </>
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userObj : state.user,
        jumlahCart: state.cart.jumlahCart
    }
}

export default connect(mapStateToProps, {resetUser, hitungCart })(NavbarComp)