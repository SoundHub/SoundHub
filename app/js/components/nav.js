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
          <NavLink to="home">
             <img src='../assets/logo2.png'></img>
          </NavLink>
        </span>

        <nav>

          <NavLink to="user">MyMusic</NavLink>
          <NavLink to="tree">Tree</NavLink>
          <Router.Link to="auth">
            <button className="authButton">Login</button>
          </Router.Link>

        </nav>
      </div>
    );
  }
}

export default Nav;
