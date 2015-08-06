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
      <nav>
        <NavLink to="home">Home</NavLink>
        <NavLink to="songs">Songs</NavLink>
        <NavLink to="song">Song</NavLink>
        <NavLink to="profile">profile</NavLink>
        <NavLink to="create">create</NavLink>
      </nav>
    );
  }
}

export default Nav;