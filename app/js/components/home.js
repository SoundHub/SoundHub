'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import AudioPlayer from './player-components/AudioPlayer';
import LoginRemindModal from './loginRemindModal'
import PageNav from './pagination';
import UserActionModal from './UserActionModal';

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';
import PlaySongStore from '../stores/playSongStore';
import ModalStore from '../stores/modalStore';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {songs: [],
                  order: 'like',
                  showRemindModal: false,
                  activePage: 1,
                  activeSong: null};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getPageNumber = this.getPageNumber(this);
    this.playsong = this.playsong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._onAction = this._onAction.bind(this);
    this._userNotAuthed = this._userNotAuthed.bind(this);
    this.closeRemindModal = this.closeRemindModal.bind(this);
    this.closeActionModal = this.closeActionModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleNewestClick = this.handleNewestClick.bind(this);
    this.handleUpvotedClick = this.handleUpvotedClick.bind(this);
    this.filter = this.filter.bind(this);
  }

  componentDidMount () {
    SongActions.getAllSongsSorted(this.state.order, 1);
    SongActions.getUserVotes(UserProfileStore.getCookieID());
    AllSongStore.addChangeListener(this._onChange);
    AllSongStore.addUpdateListener(this._onUpdate);
    AuthModalStore.addChangeListener(this._userNotAuthed);
    PlaySongStore.addChangeListener(this.playsong);
    ModalStore.addActionListener(this._onAction);
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeUpdateListener(this._onUpdate);
    AuthModalStore.removeChangeListener(this._userNotAuthed);
    PlaySongStore.removeChangeListener(this.playsong);
    ModalStore.removeActionListener(this._onAction);
  }

  playsong(){ //sets current song
    this.setState({currentsong:PlaySongStore.getSong()});
  }

  getPageNumber(){ //gets page number for pagination nav bar
    return Math.floor(AllSongStore.getSongNum() / 24) + 1;
  }

  _onChange() { //callback for AllSongStore change listener
    this.setState({songs: AllSongStore.getAllSongs()});
  }

  _onUpdate() {
    if(this.state.activeSong === AllSongStore.getCurrentSong()){
      this.setState({activeSong: null});
    }else{
      this.setState({activeSong: AllSongStore.getCurrentSong()});
    }
  }

  _userNotAuthed() {
    this.setState({showRemindModal: true})
  }

  _onAction() {
    this.setState({actionModalVisible: true, actionMessage: ModalStore.getActionMessage()})
    setTimeout(() => {
      this.closeActionModal();
    }, 500)
  }

  handleNewestClick() {
    this.setState({order: 'createdAt'});
    SongActions.getAllSongsSorted('createdAt', 1);
  }

  handleUpvotedClick() {
    this.setState({order: 'like'});
    SongActions.getAllSongsSorted('like', 1);
  }

  openModal() {
    this.setState({ showRemindModal: true })
  }

  closeRemindModal(){
    this.setState({ showRemindModal: false });
  }

  closeActionModal() {
    this.setState({actionModalVisible: false});
  }

  filter() {
    console.log("filter");
  }

  render() {
    var order = this.state.order;
    return (
      <div className= "HomePage">
      <div id="bg1">
        <img id="bg11" src="../assets/bg1.1.png"></img>
        <div className ="homeBannertitle">Open Source Music</div>
        <img id="bg12" src="../assets/bg1.2.png"></img>
      </div>
        <UserActionModal show={this.state.actionModalVisible} message={this.state.actionMessage} onHide={this.closeActionModal} />
        <div className = "sortBox">
          <button className="sortButton" onClick={this.handleNewestClick} >Newest</button>
          <button className="sortButton" onClick={this.handleUpvotedClick} >Hottest</button>
        </div>
        <LoginRemindModal show={this.state.showRemindModal} onHide={this.closeRemindModal} />
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} mode = "home" />
        </div>
          <SongList data = {this.state.songs} page='home' activeSong = {this.state.activeSong}/>
          <div className="homePageNav">
          <PageNav pages={this.getPageNumber} order={this.state.order}/>
          </div>
      </div>
    );
  }
}


export default Home;

