'use strict';
import React from 'react';
import Router from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import UserProfileStore from '../stores/userProfileStore';

class SongList extends React.Component{
  constructor() {
    super();
    this.likeClick = this.likeClick.bind(this);
    this.forkClick = this.forkClick.bind(this);
    this.playClick = this.playClick.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
   }

  togglePanel(song){
    console.log(song)
  }

  playClick(song){
    console.log(song)
  }

  forkClick(song){
    if(UserProfileStore.isLoggedIn()) {
      var userId = UserProfileStore.getCookieID();
      SongActions.forkSong(userId, song.uuid);
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

  render() {

    var songboxs = this.props.data.map(function (song, i) {
      return (
        <SongBox
          key={song.id}
          song={song}
          playClick={this.playClick.bind(this, song)}
          forkClick={this.forkClick.bind(this, song)}
          likeClick={this.likeClick.bind(this, song)}
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



      </div>
    </div>
  )}

}


export default SongList;
