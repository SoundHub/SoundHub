'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import AudioPlayer from './player-components/AudioPlayer';

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore'

class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    SongActions.getUserVotes(UserProfileStore.getCookieID())
    this.state = {songs: {allSongs: []}, showModal: false};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this.addVote = this.addVote.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
    this.forkSong = this.forkSong.bind(this);
    this.fav = this.fav.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
  }

  switchSong(song){
    this.setState({currentsong:song});
  }

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
  }

  openModal() {
    this.setState({ showModal: true })
  }

  closeModal(){
    this.setState({ showModal: false });
  }

  addVote(newVote, oldVote) {
    SongActions.addSongVote(UserProfileStore.getCookieID(), this.props.song.uuid, newVote, oldVote);
  }

  handleUpvote() {
    if(UserProfileStore.isLoggedIn()) {
      VotedSongStore.getSongVoteStatus(this.props.song.uuid)
      .then((currVal) => {
        if(currVal === 1) {
          this.addVote(0, currVal);
        } else {
          this.addVote(1, currVal);
        }
      })
      .catch((err) => {
        console.log('error: ', err)
      })
    } else {
      // TODO: tell user they need to be logged in
      this.openModal();
    }
  }

  handleDownvote() {
    if(UserProfileStore.isLoggedIn()) {
      VotedSongStore.getSongVoteStatus(this.props.song.uuid)
      .then((currVal) => {
        if(currVal === -1) {
          this.addVote(0, currVal);
        } else { // 0 or -1
          this.addVote(-1, currVal);
        }
      })
      .catch((err) => {
        console.log('error: ', err)
      })
    } else {
      this.openModal();
    }
  }

  forkSong() {
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.forkSong(userId, this.props.song.uuid);
    } else {
      this.openModal();
    }
  }

  fav() {
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.addFav(userId, this.props.song.uuid);
    } else {
      this.openModal();
    }
  }

  render() {
    return (
      <div className= "HomePage">
        <div className = "select">
          <button className="sortButton">View Newest</button>
          <button className="sortButton">View Most Upvoted</button>
        </div>
        <select>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        <Modal show={this.state.showModal} onHide={this.closeModal}> You must be logged in!</Modal>
        <hr></hr>
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} fav={this.fav} handleDownvote={this.handleDownvote} 
          handleUpvote={this.handleUpvote} forkSong={this.forkSong} mode = "home" />
        </div>
          <SongList data = {this.state.songs.allSongs} switchSong={this.switchSong}/>
      </div>
    );
  }
}


export default Home;

