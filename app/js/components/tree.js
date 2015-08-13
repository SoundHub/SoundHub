'use strict';
import React from 'react';
import treeUtils from './makeTree.js';

class D3Tree extends React.Component {
  constructor() {
    super();
  }

  onClick(element) {
    console.log('some element with onClick was clicked: ', element);
  }

  componentDidMount() {
    var mountNode = React.findDOMNode(this.refs.songTree);

    treeUtils.makeTree(this.props.treeData, mountNode, this.onClick);
  }

  shouldComponentUpdate(nextProps, nextState) {
    treeUtils.makeTree(this.props.treeData, React.findDOMNode(this.refs.songTree), this.onClick);

    return false;
  }

  render() {
    return (
      <div className="treeDiv">
        <div className="sideBar">This is Side Bar</div>
        <svg ref="songTree"></svg>
      </div>
    );
  }
}

export default D3Tree;
