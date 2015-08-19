'use strict';
import React from 'react';
import Router from 'react-router';
import SongList from './songlist';
import { Modal } from 'react-bootstrap';

import SongActions from '../actions/songActionCreators';
import AudioPlayer from './player-components/AudioPlayer';

import AllSongStore from '../stores/allSongStore';
import UserProfileStore from '../stores/userProfileStore';
import PlaySongStore from '../stores/playSongStore';

class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    SongActions.getUserVotes(UserProfileStore.getCookieID())

    this.state = {songs: {allSongs: []},
                  order: 'like',
                  showModal: false};

    this.componentDidMount = this.componentDidMount.bind(this);
    this.playsong = this.playsong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleNewestClick = this.handleNewestClick.bind(this);
    this.handleUpvotedClick = this.handleUpvotedClick.bind(this);
  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
    PlaySongStore.addChangeListener(this.playsong);
  }

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
    PlaySongStore.removeChangeListener(this.playsong);
  }

  playsong(){
    this.setState({currentsong:PlaySongStore.getSong()});
  }

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
    console.log("songs", this.state.songs);
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


  render() {
    var order = this.state.order;
    console.log(order);
    return (
      <div className= "HomePage">
        <div className = "sortBox">
          <button className="sortButton" onClick={this.handleNewestClick} >Newest</button>
          <button className="sortButton" onClick={this.handleUpvotedClick} >Hotest</button>
        </div>
        <Modal show={this.state.showModal} onHide={this.closeModal}> You must be logged in!</Modal>
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} mode = "home" />
        </div>
          <SongList data = {this.state.songs.allSongs.sort(function(a, b) {
            if (order === 'like') {
              return b[order] - a[order];
            }
            else if (order = 'createdAt') {
              let a_date = new Date(a.createdAt);
              let b_date = new Date(b.createdAt);
              console.log(a_date, b_date);
              return b_date - a_date;
            }
          })} page='home'/>
      </div>
    );
  }
}


export default Home;

