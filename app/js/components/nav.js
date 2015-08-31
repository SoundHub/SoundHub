'use strict';
import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import UserProfileStore from '../stores/userProfileStore';
import UserActions from '../actions/userActionCreators';
import ModalStore from '../stores/modalStore';

import LoginModal from './loginmodal';


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
  constructor() {
    super();
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      open:false
    }
  }
  componentDidMount() {
    ModalStore.addChangeListener(this.close);
    ModalStore.addOpenListener(this.open);
  }
  componentWillUnmount() {
    ModalStore.removeChangeListener(this.close);
    ModalStore.removeOpenListener(this.open);
  }
  open(){
    this.setState({open:true})
  }
  close(){
    this.setState({open:false})
  }
  render() {
    return (
      <div className="loginButton topButton" onClick={this.open}>Login
        <LoginModal show={this.state.open}/>
      </div>
    );
  }
};

class LogoutButton extends React.Component {
  constructor(props, context) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(){
    UserActions.logoutUser( () => {
      this.context.router.transitionTo('home');
    });
  }

  render() {
    return (
      <button className="loginButton topButton" onClick ={this.logout} >Logout</button>
    );
  }
};
LogoutButton.contextTypes = {
  router: React.PropTypes.func.isRequired
}


class Nav extends React.Component {
  constructor() {
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      loggedIn: false
    }
  }

  _onChange() {
    if (UserProfileStore.getCookieID()){
      this.setState({loggedIn: true});
    }else {
      this.setState({loggedIn: false});
    }
  }

  componentDidMount() {
    ModalStore.addChangeListener(this._onChange);
    UserProfileStore.addChangeListener(this._onChange);

    if (UserProfileStore.getCookieID()){
      this.setState({loggedIn: true});
    }else {
      this.setState({loggedIn: false});
    }
  }

  componentWillUnmount() {
    ModalStore.removeChangeListener(this._onChange);
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

          <Router.Link to="about">
            <button className="aboutButton topButton">About</button>
          </Router.Link>

        { this.state.loggedIn ?
          <Router.Link to="user">
            <button className="myhubButton topButton">MyHub</button>
          </Router.Link> : null }

        {this.state.loggedIn? <LogoutButton /> : <LoginButton />}

        </nav>
      </div>
    );
  }
};

export default Nav;
