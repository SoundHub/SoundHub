'use strict';
import React from 'react';
import Router from 'react-router';
import Navigation from './nav';

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Navigation />
        <Router.RouteHandler/>
      </div>
    );
  }
}

export default Layout;
