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
}

class Nav extends React.Component {
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    UserProfileStore.addChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({forkedSongs: ForkedSongStore.getForkedSongs()});
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
          <Router.Link to="user">
            <button className="profileButton2">Profile</button>
          </Router.Link>

          <Router.Link to="auth">
            <button className="authButton">Login</button>
          </Router.Link>

        </nav>
      </div>
    );
  }
}

export default Nav;
