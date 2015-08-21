'use strict';
import React from 'react';
import { Modal } from 'react-bootstrap';
import RouterActions from '../actions/routerActionCreators';

class CopyLinkModal  extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>

      </Modal>
    )
  }
}

export default CopyLinkModal;
