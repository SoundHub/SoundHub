'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import AudioPlayer from './player-components/AudioPlayer';
import LoginRemindModal from './loginRemindModal'
import PageNav from './pagination';

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';
import PlaySongStore from '../stores/playSongStore';


class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongsSorted('like', 1)
    SongActions.getUserVotes(UserProfileStore.getCookieID())
    this.state = {songs: [],
                  order: 'like',
                  showModal: false,
                  activePage: 1};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getPageNumber = this.getPageNumber(this);
    this.playsong = this.playsong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._userNotAuthed = this._userNotAuthed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleNewestClick = this.handleNewestClick.bind(this);
    this.handleUpvotedClick = this.handleUpvotedClick.bind(this);
    this.filter = this.filter.bind(this);
  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
    AuthModalStore.addChangeListener(this._userNotAuthed);
    PlaySongStore.addChangeListener(this.playsong);
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
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
    console.log("songs", this.state.songs);
  }

  _userNotAuthed() {
    this.setState({showModal: true})
  }

  handleNewestClick() {
    this.setState({order: 'createdAt'});
  }

  handleUpvotedClick() {
    this.setState({order: 'like'});
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
        <div className = "sortBox">
          <button className="sortButton" onClick={this.handleNewestClick} >Newest</button>
          <button className="sortButton" onClick={this.handleUpvotedClick} >Hottest</button>
        </div>
        <LoginRemindModal show={this.state.showModal} onHide={this.closeModal} />
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} mode = "home" />
        </div>
          <SongList data = {this.state.songs} page='home'/>
          <PageNav pages={this.getPageNumber} order={this.state.order}/>
      </div>
    );
  }
}


export default Home;

