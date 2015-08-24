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
  }

  render() {
    return (
      <Modal show={this.props.show} message={this.props.message} onHide={this.onClick}>
        <Modal.Header closeButton>
          <Modal.Title>Copy Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="linkMessage">
            {this.props.message}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.onClick}>Close</button>
        </Modal.Footer>
      </Modal>

    )
  }
}

export default CopyLinkModal;
