'use strict';

import React from 'react';
import { Alert } from 'react-bootstrap';

class ActionAlert extends React.Component {
  constructor() {
    super()
    this.state = { alertVisible: true }
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
  }

  render() {
    return (
      <Alert bsStyle='success' onDismiss={this.handleAlertDismiss} dismissAfter={2000}>
        <h4>{this.props.alertMessage}</h4>
      </Alert>
    )
  }

  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }

  handleAlertShow() {
    this.setState({alertVisible: this.props.alertVisible});
  }
};

export default ActionAlert;