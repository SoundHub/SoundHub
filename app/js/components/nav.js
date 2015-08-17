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
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout(){
    console.log('logout click!')
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    this.transitionTo('auth');

  }

  render() {
    return (
      <button onClick ={this.logout} >Logout</button>
    );
  }
};


class Nav extends React.Component {
  constructor() {
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      loggedin: false
    }
  }

  _onChange() {
    if (UserProfileStore.getCookieID()){
      this.setState({loggedin: true});
    }else {
      this.setState({loggedin: false});
    }
  }

  componentDidMount() {
    UserProfileStore.addChangeListener(this._onChange);
    if (UserProfileStore.getCookieID()){
      this.setState({loggedin: true});
    }else {
      this.setState({loggedin: false});
    }
  }

  componentWillUnmount() {
    UserProfileStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <div className="topBar">
        <span className = "topBarLeft">
          <NavLink to="home">
             <img src='../assets/logo2.png'></img>
          </NavLink>
        </span>
        <nav>

        { this.state.loggedin ?
          <Router.Link to="user">
            <button className="profileButton2">Profile</button>
          </Router.Link> : null }

          <Router.Link to="auth">
            {this.state.loggedin? <LogoutButton /> : <LoginButton />}
          </Router.Link>

        </nav>
      </div>
    );
  }
};

export default Nav;
