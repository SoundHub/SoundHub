'use strict';
import React from 'react';
import treeUtils from './makeTree.js';
import AudioPlayer from './player-components/AudioPlayer';
import UserActionModal from './userActionModal';

import Router from 'react-router';
import {Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import RouterActions from '../actions/routerActionCreators';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';
import AllSongStore from '../stores/allSongStore';
import ModalStore from '../stores/modalStore';

var song = [{
  title:'give you up',
  url: "assets/giveyouup.mp3",
  author:"Rick Astley",
  like:"223",
  img:"assets/album/1.png",
  id: 1
}];

import SongTreeStore from '../stores/songTreeStore.js';

class SongBox extends React.Component{
  constructor() {
    super();
  }

  render() {

    return (
      <div className = "treeboxfloat">
        <div className= "sideBar">
        <div className = "songitem2 effect8"  onClick={this.props.togglePanel}>
          <span className = "title"  > {this.props.song.title} </span>
          <span className> by {this.props.song.authorName} </span>
          <span className="like-count" > <Glyphicon glyph='heart' /> {this.props.song.like} </span>
        </div>

        <div className="songPanel2" id={this.props.key}>
          <div className="itemOther" onClick={this.props.forkClick}>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>fork</Tooltip>}>
            <Glyphicon glyph='leaf' />
          </OverlayTrigger>
          </div>

          <div className="itemOther" onClick={this.props.addfav}>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>favorite</Tooltip>}>
            <Glyphicon glyph='star' />
          </OverlayTrigger>
          </div>

          <div className="itemArrow" onClick={this.props.upvoteClick}>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>upvote</Tooltip>}>
            <Glyphicon glyph='chevron-up' />
          </OverlayTrigger>
          </div>

          <div className="itemArrow" onClick={this.props.downvoteClick}>
          <OverlayTrigger placement='bottom' overlay={<Tooltip>downvote</Tooltip>}>
            <Glyphicon glyph='chevron-down' />
          </OverlayTrigger>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

class D3Tree extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSong: {},
      actionModalVisible: false
    }

    this.onClick = this.onClick.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onAction = this._onAction.bind(this);
    this.closeActionModal = this.closeActionModal.bind(this);
    this.addVote = this.addVote.bind(this);
    this.addfav = this.addfav.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.forkClick = this.forkClick.bind(this);
    this.upvoteClick = this.upvoteClick.bind(this);
    this.downvoteClick = this.downvoteClick.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
  }

  componentDidMount() {
    AllSongStore.addChangeListener(this._onChange);
    ModalStore.addActionListener(this._onAction);
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
    ModalStore.removeActionListener(this._onAction);   
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

  togglePanel(song){
    console.log(song)
  }

  forkClick(song){
    if(UserProfileStore.isLoggedIn()) {
      RouterActions.openUserActionModal('fork');
      var userId = UserProfileStore.getCookieID();
      SongActions.forkSong(userId, song.uuid);
    } else {
      RouterActions.openLoginRemindModal();
    }
  }

  addVote(newVote, oldVote,songId) {
    SongActions.addSongVote(UserProfileStore.getCookieID(), songId, newVote, oldVote);
  }

  addfav(song){
    if(UserProfileStore.isLoggedIn()) {
      RouterActions.openUserActionModal('favorite');
      var userId = UserProfileStore.getCookieID();
      SongActions.addFav(userId, song.uuid);
    } else {
      RouterActions.openLoginRemindModal();
    }
  }

  createClick(song){
    SongActions.createFromFork(song);
  }

  likeClick(song){
    console.log('like click');
  }

  upvoteClick(song){
    if(UserProfileStore.isLoggedIn()) {
      VotedSongStore.getSongVoteStatus(song.uuid)
      .then((currVal) => {
        if(currVal === 1) {
          console.log('upvote clicked: ', currVal);
          this.addVote(0, currVal,song.uuid);
        } else {
          this.addVote(1, currVal,song.uuid);
        }
      })
      .catch((err) => {
        console.log('error: ', err)
      })
    } else {
      RouterActions.openLoginRemindModal();
    }
  }

  downvoteClick(song){
    if(UserProfileStore.isLoggedIn()) {
      VotedSongStore.getSongVoteStatus(song.uuid)
      .then((currVal) => {
        console.log('downvote clicked: ', currVal, ' ', song.uuid);
        if(currVal === -1) {
          this.addVote(0, currVal,song.uuid);
        } else { // 0 or -1
          this.addVote(-1, currVal,song.uuid);
        }
      })
      .catch((err) => {
        console.log('error: ', err)
      })
    } else {
      RouterActions.openLoginRemindModal();
    }
  }

  closeActionModal() {
    this.setState({actionModalVisible: false});
  }

  _onChange() {
    AllSongStore.getSongById(this.state.currentSong.uuid)
    .then((song) => {
      console.log('tree.js songs changed: ', song);
      this.setState({currentSong: song});
    });
    // console.log('songs changed: ', this.state.currentSong);
  }

  _onAction() {
    this.setState({actionModalVisible: true, actionMessage: ModalStore.getActionMessage()})
    setTimeout(() => {
      this.closeActionModal();
    }, 500)
  }

  render() {
    return (
      <div className="treeDiv">
        <div className = "treeBox">
          <div ref="songTree"></div>
        </div>
        <UserActionModal show={this.state.actionModalVisible} message={this.state.actionMessage} onHide={this.closeActionModal}/>
        <SongBox
          key={song.id}
          song = {this.state.currentSong}
          addfav={this.addfav.bind(this, this.state.currentSong)}
          forkClick={this.forkClick.bind(this, this.state.currentSong)}
          downvoteClick={this.downvoteClick.bind(this, this.state.currentSong)}
          upvoteClick={this.upvoteClick.bind(this, this.state.currentSong)}
        />
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentSong} mode = "home" />
        </div>
      </div>
    );
  }

}

export default D3Tree;
