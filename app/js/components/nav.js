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

class Nav extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedin: 'login'
    }
    this.toggleLogin = this.toggleLogin.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._onChange = this._onChange.bind(this);

  }
  componentWillUnmount() {
    UserProfileStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    if(UserProfileStore.getCookieID()){
      console.log('profile store change!!!!')
    }

  componentDidMount() {
    if (UserProfileStore.getCookieID()) {
      this.setState({loggedin: 'logout'});
    }
    else {
      this.setState({loggedin: 'login'});
    }
    console.log("LOGIN STATE: ", this.state.loggedin);
    UserProfileStore.addChangeListener(this._onChange);
  }

  toggleLogin() {


  }

  render() {
    // let loginButton = this.state.loggedin ? "Logout" : "Login";
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
            <button className="authButton">{this.state.loggedin}</button>
          </Router.Link>

        </nav>
      </div>
    );
  }
};

export default Nav;
