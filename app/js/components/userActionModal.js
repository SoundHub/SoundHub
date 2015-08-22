'use strict';
import React from 'react';
import { Modal } from 'react-bootstrap';
import RouterActions from '../actions/routerActionCreators';
import UserActions from '../actions/userActionCreators';

class UserActionModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <Modal show={this.props.show} onHide={this.props.onHide}>
      <Modal.Body> {this.props.message} </Modal.Body>
    </Modal>
    )
  }
}

export default UserActionModal;
