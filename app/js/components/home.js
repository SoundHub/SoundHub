'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import RouterActions from '../actions/routerActionCreators';
import AudioPlayer from './player-components/AudioPlayer';

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    SongActions.getUserVotes(UserProfileStore.getCookieID())
    this.state = {songs: {allSongs: []},
                  order: 'like',
                  showModal: false};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._userNotAuthed = this._userNotAuthed.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleNewestClick = this.handleNewestClick.bind(this);
    this.handleUpvotedClick = this.handleUpvotedClick.bind(this);
  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
    AuthModalStore.addChangeListener(this._userNotAuthed);
    UserActions.openAuthModal(); // testing the modal action
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
    AuthModalStore.removeChangeListener(this._userNotAuthed);
  }

  switchSong(song){
    this.setState({currentsong:song});
  }

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
    console.log("songs", this.state.songs);
  }

  _userNotAuthed() {
    console.log('user not authed')
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

  fav(){
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.addFav(userId, this.state.currentsong.uuid);
    } else {
      this.openModal();
    }
  }

  render() {
    var order = this.state.order;
    console.log(order);
    return (
      <div className= "HomePage">
        <div className = "select">
          <button className="sortButton" onClick={this.handleNewestClick} >View Newest</button>
          <button className="sortButton" onClick={this.handleUpvotedClick} >View Most Upvoted</button>
        </div>
        <select>
          <option value="volvo">Volvo</option>
          <option value="saab"> Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        <Modal show={this.state.showModal} onHide={this.closeModal}> You must be logged in!</Modal>
        <hr></hr>
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} fav={this.fav} handleDownvote={this.handleDownvote}
          handleUpvote={this.handleUpvote} mode = "home" />
        </div>
          <SongList data = {this.state.songs.allSongs} switchSong={this.switchSong} page='home'/>
      </div>
    );
  }
}


export default Home;

