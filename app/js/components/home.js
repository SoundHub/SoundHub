'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import AudioPlayer from './player-components/AudioPlayer';
import LoginRemindModal from './loginRemindModal'
import PageNav from './pagination';
import ActionAlert from './actionAlert'

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';
import PlaySongStore from '../stores/playSongStore';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {songs: [],
                  order: 'like',
                  showModal: false,
                  activePage: 1,
                  activeSong: null};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getPageNumber = this.getPageNumber(this);
    this.playsong = this.playsong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._userNotAuthed = this._userNotAuthed.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeUpdateListener(this._onUpdate);
    AuthModalStore.removeChangeListener(this._userNotAuthed);
    PlaySongStore.removeChangeListener(this.playsong);
  }

  playsong(){
    this.setState({currentsong:PlaySongStore.getSong()});
  }

  getPageNumber(){
    return Math.floor(AllSongStore.getSongNum() / 6) + 2;
  }

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
  }

  _onUpdate() {
    console.log('update in component');
    this.setState({activeSong: AllSongStore.getCurrentSong()});
  }

  _userNotAuthed() {
    this.setState({showModal: true})
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
    this.setState({ showModal: true })
  }

  closeModal(){
    this.setState({ showModal: false });
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
        <div className ="homeBannertitle">Collaborating of Music</div>
        <div className ="homeBannerSubtitle">See how amazing music is being created from a simple motif</div>
        <img id="bg12" src="../assets/bg1.2.png"></img>
      </div>
        <div className = "sortBox">
          <button className="sortButton" onClick={this.handleNewestClick} >Newest</button>
          <button className="sortButton" onClick={this.handleUpvotedClick} >Hottest</button>
        </div>
        <LoginRemindModal show={this.state.showModal} onHide={this.closeModal} />
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} mode = "home" />
        </div>
          <SongList data = {this.state.songs} page='home' activeSong = {this.state.activeSong}/>
          <PageNav pages={this.getPageNumber} order={this.state.order}/>
      </div>
    );
  }
}


export default Home;

