import { Alert } from 'react-bootstrap';

class ActionAlert extends React.Component {
  constructor() {
    super()
    this.state = { alertVisible: false }
  }
  
  render() {
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss} dismissAfter={2000}>
          <h4>Oh snap! You got an error!</h4>
          <p>But this will hide after 2 seconds.</p>
        </Alert>
      );
    }

    return (
      <Button onClick={this.handleAlertShow}>Show Alert</Button>
    );
  }

  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }

  handleAlertShow() {
    this.setState({alertVisible: true});
  }
});