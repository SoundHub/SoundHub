'use strict';
import React from 'react';

class Login extends React.Component {

  render() {
    return (
        <div className="AuthForm">
          <h1>This is Login</h1>
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />
          <input type="button" value="Login" />
          <input type="button" value="Signup" onClick={this.toggleAuth}/>
        </div>
      );
  }
}

class Signup extends React.Component {

  render() {
    return (
        <div className="AuthForm">
          <h1>This is Signup</h1>
          <input type="text" placeholder="Email" ref="email" />
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />
          <input type="button" value="Login" />
          <input type="button" value="Signup"/>
        </div>
      );
  }
}

class Auth extends React.Component {

  render() {
    return (
      <div className = "authPage">
        <div className="authBanner">
          <div className="authBannerTitle">SongHub</div>
        </div>
        <Login/>
      </div>
    );
  }
}


export default Auth;
