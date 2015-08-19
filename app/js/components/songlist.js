'use strict';
import React from 'react';
import Router from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';


class SongList extends React.Component{
  constructor() {
    super();
    this.addVote = this.addVote.bind(this);
    this.addfav = this.addfav.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.forkClick = this.forkClick.bind(this);
    this.playClick = this.playClick.bind(this);
    this.upvoteClick = this.upvoteClick.bind(this);
    this.downvoteClick = this.downvoteClick.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
   }

  togglePanel(song){
    console.log(song)
  }

  playClick(song){
    SongActions.playSong(song);
  }

  forkClick(song){
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.forkSong(userId, song.uuid);
    } else {
      console.log('need login');
    }
  }

  addVote(newVote, oldVote,songId) {
    SongActions.addSongVote(UserProfileStore.getCookieID(), songId, newVote, oldVote);
  }

  addfav(song){
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.addFav(userId, song.uuid);
    } else {
      console.log('need login');
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
          this.addVote(0, currVal,song.uuid);
        } else {
          this.addVote(1, currVal,song.uuid);
        }
      })
      .catch((err) => {
        console.log('error: ', err)
      })
    } else {
      console.log('need login');
    }
  }

  downvoteClick(song){
    if(UserProfileStore.isLoggedIn()) {
      VotedSongStore.getSongVoteStatus(song.uuid)
      .then((currVal) => {
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
      console.log('need login');
    }
  }




  render() {

    var songboxs = this.props.data.map(function (song, i) {
      return (
        <SongBox
          key={song.id}
          song={song}
          addfav={this.addfav.bind(this, song)}
          playClick={this.playClick.bind(this, song)}
          forkClick={this.forkClick.bind(this, song)}
          likeClick={this.likeClick.bind(this, song)}
          downvoteClick={this.downvoteClick.bind(this, song)}
          upvoteClick={this.upvoteClick.bind(this, song)}
          createClick={this.createClick.bind(this, song)}
          page = {this.props.page}
        />
      );
    }, this);

    return (
      <div className="playList" >
        {songboxs}
      </div>
    );
  }
}
class SongBox extends React.Component{
  constructor() {
    super();
   }

  render() {
    return(
    <div className ="songBox" >
      <div className = "songItem effect8"  onClick={this.props.togglePanel}>
          <Router.Link to="tree"  params={this.props.song}>
            <span className = "title"  > {this.props.song.title} </span>
          </Router.Link>
        <span className> by {this.props.song.authorName} </span>
        <span className="like-count" > <Glyphicon glyph='heart' /> {this.props.song.like} </span>
      </div>

      <div className="songPanel" id={this.props.key}>
        <div className="itemOther" onClick={this.props.playClick}>
          <Glyphicon glyph='play' />
        </div>
        {this.props.page==='fork' ?
        <div className="itemOther" onClick={this.props.createClick}>
          <Glyphicon glyph='tags' />
        </div>: null}

        {this.props.page==='fork' ?
        <a href={this.props.song.url} download>
          <div className="itemOther" >
            <Glyphicon glyph='download' />
          </div>
        </a> : null}

        {this.props.page==='home' ?
        <div className="itemOther" onClick={this.props.forkClick}>
          <Glyphicon glyph='paperclip' />
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemOther" onClick={this.props.addfav}>
          <Glyphicon glyph='heart' />
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemOther" onClick={this.props.upvoteClick}>
          <Glyphicon glyph='chevron-up' />
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemOther" onClick={this.props.downvoteClick}>
          <Glyphicon glyph='chevron-down' />
        </div>: null}

      </div>
    </div>
  )}

}


export default SongList;
