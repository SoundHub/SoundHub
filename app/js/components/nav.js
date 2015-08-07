'use strict';
import _ from 'lodash';
import React from 'react';
import Router from 'react-router';

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
  render() {
    return (
      <div className="topBar">
        <span className = "topBarLeft">
          <img src='../assets/placeholder.jpg'></img>
          <div className = "greeting">Hello User</div>
        </span>

        <nav>
          <NavLink to="home">Home</NavLink>
          <NavLink to="mymusic">MyMusic</NavLink>
          <NavLink to="tree">Tree</NavLink>
          <NavLink to="profile">Profile</NavLink>
          <NavLink to="create">Create</NavLink>
          <NavLink to="auth">Auth</NavLink>
        </nav>
      </div>
    );
  }
}

export default Nav;
