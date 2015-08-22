'use strict';
import React from 'react';
import { Modal } from 'react-bootstrap';
import RouterActions from '../actions/routerActionCreators';

class CopyLinkModal  extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this);

  }
  onClick() {
    this.props.onHide();
    // open login modal
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header >
          <Modal.Title>Copy Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Hello, this is modal.</p>

        </Modal.Body>


      </Modal>

    )
  }
}

export default CopyLinkModal;
