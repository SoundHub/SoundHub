// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'lodash';
import AllSongStore from './allSongStore';

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
      console.log('setting user vote from ', song.upvote, ' to ', voteInfo.vote)
      song.upvote = voteInfo.vote;
      songExists = true;
      return false;
    }
  })
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
        AllSongStore.getSongById(songId)
        .then((song) => {
          var toVote = _.cloneDeep(song);
          toVote.upvote = 0;
          console.log('get song: ', toVote)
          _votedSongs.push(toVote);
          resolve(0);
        })
      } else {
        var notFound = true;
        _.forEach(_votedSongs, (song) => {
          if(song.uuid === songId) {
            console.log('found song, previous user vote: ', song.upvote)
            notFound = false;
            resolve(song.upvote);
            return false;
          }
        })
        if(notFound) {
          console.log('user has not upvoted this song')
          AllSongStore.getSongById(songId)
          .then((song) => {
            var toVote = _.cloneDeep(song);
            toVote.upvote = 0;
            console.log('get song: ', toVote)
            _votedSongs.push(toVote);
            resolve(0);
            return;
          })
          .then(() => {
            reject(Error('nothing found'))
          })
        }
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
