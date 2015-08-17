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
  console.log('setUserVotedSongs as: ',_votedSongs);
}

var addVote = function(voteInfo) {
  _.forEach(_votedSongs, (song, i) => {
    if(song.uuid === voteInfo.songId) {
      console.log('setting song vote from ', song.like, 'to ', voteInfo.vote)
      song.like = voteInfo.vote;
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
        console.log('user has not voted on anything')
        resolve(0);
      } else {
        var notFound = true;
        _.forEach(_votedSongs, (song) => {
          if(song.uuid === songId) {
            notFound = false;
            console.log('found a match', song.like)
            resolve(song.like);
            return false;
          }
        })
        if(notFound) {
          console.log('user has not voted on this specific song')
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
      console.log('enter voted song store', payload)
      setUserVotedSongs(payload.songs);
      console.log('vote store',payload.songs)
      VotedSongStore.emitChange();
      break;

    case ActionType.VOTE:
      addVote(payload.voteInfo);
    default:
      // do nothing
  }

});

export default VotedSongStore;
