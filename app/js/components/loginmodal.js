'use strict';
import React from 'react';
import { Modal } from 'react-bootstrap';
import RouterActions from '../actions/routerActionCreators';
import UserActions from '../actions/userActionCreators';

var ENTER_KEY_CODE = 13;

class Login extends React.Component {

  constructor(props, context) {
    super(props);
    this.toggleAuth = this.toggleAuth.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  toggleAuth() { this.props.handleToggle('Signup'); }

  handleLogin() {
    let userData = {};
    userData.username = this.refs.username.getDOMNode().value;
    userData.password = this.refs.password.getDOMNode().value;
    if(userData.username && userData.password){
      UserActions.loginUser(userData);
    }

  }

  handleKeyDown(event) {
    if(event.keyCode === ENTER_KEY_CODE) {
      this.handleLogin();
    }
  }

  render() {
    return (
        <div className="AuthForm" onKeyDown={this.handleKeyDown}>
          <div className="modalButtonBox3">
            <p><input type="text" placeholder="Username" ref="username" /></p>
            <p><input type="password" placeholder="Password" ref="password" /></p>
          </div>
          <hr></hr>
          <div className="modalButtonBox">
            <input className="topButton aboutButton" type="button" value="Login"
            onClick={this.handleLogin}/>
          </div>
          <div className="modalButtonBox2">
            <a onClick={this.toggleAuth}>Don't Have an Account?</a>
          </div>


        </div>
      );
  }
}


class Signup extends React.Component {
  constructor() {
    super();
    this.toggleAuth = this.toggleAuth.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
   }

  toggleAuth() {
    this.props.handleToggle('Login');
  }

  handleSignup() {
    let nameStr = /^[A-Za-z0-9_]{1,20}$/;
    let passwordStr = /^.{3,64}$/;
    let userData = {};
    console.log('refs', this.refs)
    userData.username = this.refs.username.getDOMNode().value;
    userData.password = this.refs.password.getDOMNode().value;
    userData.verpassword = this.refs.verpassword.getDOMNode().value;
    userData.email = this.refs.email.getDOMNode().value;

    if(!userData.username.match(nameStr)){
      alert('Username can have only letters, numbers or underscores');
    }else if(userData.username.length < 1){
      alert('Username must have at least 1 character');
    }else if (userData.password !== userData.verpassword) {
      alert('Passwords must match');
    }else if (!userData.password.match(passwordStr)) {
      alert('Password must be between 8 and 64 characters');
    }else {
      UserActions.createUser(userData, () => {});
      // this.toggleAuth();
    }
  }

  render() {
    return (
        <div className="AuthForm">
        <div className="modalButtonBox3">
          <p><input type="text" placeholder="Username" ref="username" /></p>
          <p><input type="password" placeholder="Password" ref="password" /></p>
          <p><input type="password" placeholder="Verify password" ref="verpassword" /></p>
          <p><input type="email" placeholder="Email" ref="email" /></p>
        </div>

          <hr></hr>
          <div className="modalButtonBox">
            <input className="topButton aboutButton" type="button" value="Signup" onClick={this.handleSignup}/>
          </div>
           <div className="modalButtonBox2">
             <a onClick={this.toggleAuth}>Already Have an Account?</a>
           </div>
        </div>
      );
  }
}

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {authType: props.authType};
    this.close = this.close.bind(this);
  }

 close(){
  RouterActions.closeLoginModal()
 }

 toggle(data){
    this.setState({authType:data}, () => {});
  }

  handleLogout() {
    UserActions.logoutUser();
  }

  render() {
    var authform = <Login handleToggle = {this.toggle}/>;
    var authtitle = <Modal.Title>LOGIN</Modal.Title>

    if(this.state.authType === 'Signup'){
      authform = <Signup handleToggle = {this.toggle}/>
      authtitle = <Modal.Title>SIGNUP</Modal.Title>
    }

    return (
      <div>
        <Modal bsSize='small' show={this.props.show} onHide={this.close}>
          <Modal.Header closeButton>
            {authtitle}
          </Modal.Header>
          <Modal.Body>
            {authform}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};

export default LoginModal;


