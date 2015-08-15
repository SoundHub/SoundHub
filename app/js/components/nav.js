'use strict';
import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import UserProfileStore from '../stores/userProfileStore';


class NavLink extends React.Component {
  render() {
    let other = _.omit(this.props, 'to', 'other');
    let names = [].concat(this.props.to); //typecast to array
    let className = this.props.className || '';
    return (
      <Router.Link to={ names[0] } className={ className } {...other} />
    );
  }
};



class LoginButton extends React.Component {
  render() {
    return (
      <button>Login</button>
    );
  }
};



class LogoutButton extends React.Component {
  render() {
    return (
      <button>Logout</button>
    );
  }
};


class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedin: false
    }
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    if(UserProfileStore.getCookieID()){
      console.log('profile store change!!!!')
    }
  }

  componentWillMount() {
    UserProfileStore.addChangeListener(this._onChange);
    if (UserProfileStore.getCookieID()) {
      this.setState({loggedin: true});
    }else {
      this.setState({loggedin: false});
    }
    console.log("LOGIN STATE: ", this.state.loggedin);
  }

  componentWillUnmount() {
    UserProfileStore.removeChangeListener(this._onChange);
  }

  render() {
    var authButton;
    if(this.state.loggedin === true){
      authButton = <LogoutButton />
    }else{
      authButton = <LoginButton />
    }

    return (
      <div className="topBar">
        <span className = "topBarLeft">
          <NavLink to="home">
             <img src='../assets/logo2.png'></img>
          </NavLink>
        </span>

        <nav>
          <Router.Link to="user">
            <button className="profileButton2">Profile</button>
          </Router.Link>

          <Router.Link to="auth">
            {authButton}
          </Router.Link>

        </nav>
      </div>
    );
  }
};

export default Nav;
