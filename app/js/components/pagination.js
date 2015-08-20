'use strict';
import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import UserProfileStore from '../stores/userProfileStore';
import UserActions from '../actions/userActionCreators';
import ModalStore from '../stores/modalStore';
import { Pagination } from 'react-bootstrap';
import LoginModal from './loginmodal';


class PageNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    }
  }

  onClick() { 
  }

  render() {
    return (
    <Pagination/>
    )
  } 
}

export default PageNav;