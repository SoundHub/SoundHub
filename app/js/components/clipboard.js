import React from 'react';

class Clipboard extends React.Component{
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

  }

  // propTypes: {
  //   value : React.PropTypes.string.isRequired
  // }

  // getDefaultProps() {
  //   return {
  //     className : "clipboard"
  //   };
  // }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  handleKeyDown(e) {
    let metaKeyIsDown = (e.ctrlKey || e.metaKey);
    let textIsSelected = window.getSelection().toString();

    if(!metaKeyIsDown || textIsSelected) {
      return;
    }

    let element = React.findDOMNode(this).firstChild;
    element.focus();
    element.select();
  }

  handleKeyUp(e) {
    let element = React.findDOMNode(this).firstChild;
    element.blur();
  }

  render() {
    let textareaValue = this.props.value;
    console.log("textareavalue: ",textareaValue);
    return (
      <div>
        <textarea readOnly className="clipboard" value= {textareaValue} />
      </div>
      );
  }

};

export default Clipboard;
