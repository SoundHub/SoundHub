'use strict';
import React from 'react';
import { Modal } from 'react-bootstrap';
import RouterActions from '../actions/routerActionCreators';
import UserActions from '../actions/userActionCreators';

class LoginRemindModal extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onHide();
    // open login modal
    RouterActions.openLoginModal();
  }

  render() {
    return (
    <Modal show={this.props.show} onHide={this.props.onHide}>
      <Modal.Header>
        <Modal.Title>Please Login</Modal.Title>
      </Modal.Header>
      <Modal.Body> You must be logged in to do this!</Modal.Body>
      <Modal.Footer>
        <button className="topButton aboutButton" onClick={this.onClick}>Login</button>
      </Modal.Footer>
    </Modal>
    )
  }
}

export default LoginRemindModal;
