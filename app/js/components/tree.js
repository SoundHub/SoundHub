'use strict';
import React from 'react';
import treeUtils from './makeTree.js';
import AudioPlayer from './player-components/AudioPlayer';

var song = [{
  title:'give you up',
  url: "assets/giveyouup.mp3",
  author:"Rick Astley",
  like:"223",
  img:"assets/album/1.png",
  id: 1
}];

import SongTreeStore from '../stores/songTreeStore.js';

class D3Tree extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSong: {}
    }

    this.onClick = this.onClick.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.render = this.render.bind(this);
    // this._onChange = this._onChange.bind(this);
  }

  onClick(element) {
    // console.log('tree.js onClick element-clicked: ', element);  // for testing so we don't hit up S3 everytime
    this.setState({ currentSong: element });  // for actual use
  }

  // componentDidMount() {
  //   var mountNode = React.findDOMNode(this.refs.songTree);

  //   // Call from event loop so we can get the tree data first
  //   console.log('tree.js componentDidMount: ', this.props.treeData);
  //   treeUtils.makeTree(this.props.treeData, mountNode, this.onClick);
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   treeUtils.makeTree(nextProps.treeData, React.findDOMNode(this.refs.songTree), this.onClick);

  //   return false;
  // }

  // We need to receive the tree data before we can render it
  componentWillReceiveProps(nextProps) {
    var mountNode = React.findDOMNode(this.refs.songTree);
    treeUtils.makeTree(nextProps.treeData, mountNode, this.onClick, nextProps.uuid);
  }

  render() {
    return (
      <div className="treeDiv">
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentSong} mode = "home" />
        </div>
        <div className = "treeBox">
          <div ref="songTree"></div>
        </div>
      </div>
    );
  }

  // _onChange() {
  //   this.setState({currentSong: SongTreeStore.getSongTree()});
  //   console.log(this.state);
  // }
}

export default D3Tree;
