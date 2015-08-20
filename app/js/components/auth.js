'use strict';
import React from 'react';
import Router from 'react-router';
import Carcousel from './carcousel'

class Auth extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className = "authPage">
        <div className = "Carcouselbox">
          <Carcousel bsSize="small"/>
        </div>
      </div>
    );
  }
}

export default Auth;