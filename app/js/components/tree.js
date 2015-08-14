'use strict';
import React from 'react';
import treeUtils from './makeTree.js';
import AudioPlayer from './player-components/AudioPlayer';

var song = {
  title:'badboy',
  url: "assets/badboy.mp3",
  author:"big bang",
  like:"223",
  img:"assets/album/1.png",
  id: 1
}

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
        <div className= "playerBox">
          <AudioPlayer song = {song} mode = "home" />
        </div>
        <div className = "treeBox">
          <svg ref="songTree"></svg>
        </div>
      </div>
    );
  }
}

export default D3Tree;
