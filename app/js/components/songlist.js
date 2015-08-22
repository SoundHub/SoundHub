'use strict';
import React from 'react';
import Router from 'react-router';
import {Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import RouterActions from '../actions/routerActionCreators';
import UserProfileStore from '../stores/userProfileStore';
import VotedSongStore from '../stores/votedSongStore';
import AuthModalStore from '../stores/authModalStore';
import AlertStore from '../stores/alertStore';


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
    this.shareLink = this.shareLink.bind(this);
  }


  togglePanel(id){
    SongActions.updateActiveSong(id);
  }

  playClick(song){
    SongActions.playSong(song);
  }

  forkClick(song){
    if(UserProfileStore.isLoggedIn()) {
      RouterActions.openUserActionModal('fork');
      // RouterActions.alertUserAction('fork');
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
      // RouterActions.alertUserAction('favorite');
      var userId = UserProfileStore.getCookieID();
      SongActions.addFav(userId, song.uuid);
    } else {
      RouterActions.openLoginRemindModal();
    }
  }

  createClick(song){
    SongActions.createFromFork(song);
  }

  shareLink(song){
    let origin = window.location.origin;
    let link = origin + '/tree/' + song.rootId + '&' + song.uuid;
    window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
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
      RouterActions.openLoginRemindModal();
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
      RouterActions.openLoginRemindModal();
    }
  }

  render() {
    var activeSong = this.props.activeSong;
    var songboxs = this.props.data.map(function (song, i) {
      return (
        <SongBox
          activeId={activeSong}
          key={song.uuid}
          song={song}
          addfav={this.addfav.bind(this, song)}
          playClick={this.playClick.bind(this, song)}
          forkClick={this.forkClick.bind(this, song)}
          likeClick={this.likeClick.bind(this, song)}
          downvoteClick={this.downvoteClick.bind(this, song)}
          upvoteClick={this.upvoteClick.bind(this, song)}
          shareLink={this.shareLink.bind(this, song)}
          createClick={this.createClick.bind(this, song)}
          togglePanel={this.togglePanel.bind(this, song)}
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
    var normCss = 'songItem effect8';
    var selectedCss = 'songItemActive effect8';

    return (
    <div className ="songBox" key={this.props.key}>
      <div className = {this.props.song.uuid === this.props.activeId ? selectedCss : normCss}  onClick={(function() {this.props.playClick(); this.props.togglePanel(this.props.song.uuid);}).bind(this)}>
        <span className = "title" > {this.props.song.title} </span>
        <span className> by {this.props.song.authorName} </span>
        <span className="like-count" > <Glyphicon glyph='heart' /> {this.props.song.like} </span>
      </div>

      <div className= 'songPanel'  id={this.props.key}>

        {this.props.page==='fork' ?
        <div className="itemOther" onClick={this.props.createClick}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>upload your new sound</Tooltip>}>
          <Glyphicon glyph='tags' />
        </OverlayTrigger>
        </div>: null}

        {this.props.page==='fork' ?
        <a href={this.props.song.url} download>
          <div className="itemOther" >
          <OverlayTrigger placement='bottom' overlay={<Tooltip>download</Tooltip>}>
            <Glyphicon glyph='download' />
          </OverlayTrigger>
          </div>
        </a> : null}

        {this.props.page==='home' || this.props.page=== 'fav' || this.props.page=== 'mymusic' || this.props.page=== 'fork' ?
        <div className="itemOther">
        <OverlayTrigger placement='bottom' overlay={<Tooltip>tree</Tooltip>}>
          <Router.Link to="tree"  params={this.props.song}>
            <Glyphicon glyph='tree-deciduous' />
          </Router.Link>
        </OverlayTrigger>
        </div> : null}

        {this.props.page==='home' || this.props.page=== 'mymusic' ?
        <div className="itemOther" onClick={this.props.forkClick}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>branch</Tooltip>}>
          <Glyphicon glyph='leaf'/>
        </OverlayTrigger>
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemOther" onClick={this.props.addfav}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>favorite</Tooltip>}>
          <Glyphicon glyph='star' />
        </OverlayTrigger>
        </div>: null}

        {this.props.page==='home' || this.props.page=== 'fav' || this.props.page=== 'mymusic' ?
        <div className="itemOther" onClick={this.props.shareLink}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>share link</Tooltip>}>
          <Glyphicon glyph='share' />
        </OverlayTrigger>
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemArrow" onClick={this.props.upvoteClick}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>upvote</Tooltip>}>
          <Glyphicon glyph='chevron-up' />
        </OverlayTrigger>
        </div>: null}

        {this.props.page==='home' ?
        <div className="itemArrow" onClick={this.props.downvoteClick}>
        <OverlayTrigger placement='bottom' overlay={<Tooltip>downvote</Tooltip>}>
          <Glyphicon glyph='chevron-down' />
        </OverlayTrigger>
        </div>: null}

      </div>
    </div>
  )}

}


export default SongList;
