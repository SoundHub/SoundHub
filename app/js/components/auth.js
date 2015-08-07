'use strict';
import React from 'react';
import Router from 'react-router';

class Login extends React.Component {

  constructor() {
    super();
    this.toggleAuth = this.toggleAuth.bind(this);
    this.login = this.login.bind(this);
   }

  toggleAuth() { this.props.handleToggle('Signup');}

  login() {
    self.transitionTo('home');
  }

  render() {
    return (
        <div className="AuthForm">
          <h1>This is Login</h1>
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />

          <Router.Link to="home">
            <input type="button" value="Login" onClick={this.login}/>
          </Router.Link>

          <input type="button" value="Signup" onClick={this.toggleAuth}/>
        </div>
      );
  }
}



class Signup extends React.Component {
  constructor() {
    super();
    this.toggleAuth = this.toggleAuth.bind(this);
   }

   toggleAuth() {
    this.props.handleToggle('Login');
  }

  render() {
    return (
        <div className="AuthForm">
          <h1>This is Signup</h1>
          <input type="text" placeholder="Email" ref="email" />
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />
          <input type="button" value="Login" onClick={this.toggleAuth}/>
          <input type="button" value="Signup"/>
        </div>
      );
  }
}

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {authType: props.authType}
   }

  toggle(data){
    this.setState({authType:data}, () => {
      // console.log(this.state.authType);
    });
  }

  render() {
    var state = <Login handleToggle = {this.toggle}/>;
    if(this.state.authType === 'Signup'){
      state = <Signup handleToggle = {this.toggle}/>
    }else if(this.state.authType === 'Login'){
      state = <Login handleToggle = {this.toggle}/>
    }
    return (
      <div className = "authPage">
        <div className="authBanner">
          <div className="authBannerTitle">SongHub</div>
        </div>
        {state}
      </div>
    );
  }
}

Auth.defaultProps = { authType : "login"}


export default Auth;
