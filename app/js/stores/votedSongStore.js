// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'lodash'

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _votedSongs = [];

var setUserVotedSongs = function(songs) {
  _votedSongs = songs;
  console.log('user voted songs: ', _votedSongs)
}

var addNewSong = function(songData) {

}

var addVote = function(voteInfo) {
  var songExists = false;
  _.forEach(_votedSongs, (song) => {
    if(song.uuid === voteInfo.songId) {
      console.log('setting user vote from ', song.like, ' to ', voteInfo.vote)
      song.like = voteInfo.vote;
      songExists = true;
      return false;
    }
  })
  if(!songExists) {
    console.log('song does not exist, adding it now: ', voteInfo.songData)
    songData.like = voteInfo.vote;
    _votedSongs.push(songData);
    console.log('vote info should have new song: ', songData);
  }
}

var VotedSongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getVotes() {
    console.log(_votedSongs);
  },
  getSongVoteStatus(songId) {
    return new Promise((resolve, reject) => {
      if(_votedSongs.length === 0) {
        console.log('user has not upvoted anything')
        resolve(0);
      } else {
        var notFound = true;
        _.forEach(_votedSongs, (song) => {
          if(song.uuid === songId) {
            console.log('found song, previous user vote: ', song.like)
            notFound = false;
            resolve(song.like);
            return false;
          }
        })
        if(notFound) {
          console.log('user has not upvoted this song')
          resolve(0);
        }
        reject(Error('nothing found'))
      }
    })
  }
})

VotedSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.GET_USER_VOTES:
      setUserVotedSongs(payload.songs);
      VotedSongStore.emitChange();
      break;

    case ActionType.VOTE:
      addVote(payload.voteInfo);
      break;
    
    case ActionType.NEW_SONG_VOTED:
      addNewSong(payload.songData)
      break;

    default:
      // do nothing
  }

});

export default VotedSongStore;
