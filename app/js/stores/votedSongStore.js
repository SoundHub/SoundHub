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
  return new Promise((resolve, reject) => {
    var diff = voteInfo.vote - voteInfo.prev;
    _.forEach(_votedSongs, (song) => {
      if(song.uuid === voteInfo.songId) {
        song.like += diff;
        console.log('song changing: ', song)
        resolve(song.like)
        return false;
      }
    })
    console.log('out of foreach loop')
    reject(Error('nothing found'))
  })
}

// // changes vote when 
// var changeVote = function(songId, voteVal) {
//   _.forEach(_votedSongs, function(val) {
//     if(val.uuid === songId) {
//       // check if 
//     }
//   })
// }

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
        resolve(0);
      } else {
        _.forEach(_votedSongs, (song) => {
          if(song.uuid === songId) {
            console.log('song liked', song.genre, song)
            resolve(song);
            return false;
            console.log('did not break out of loop')
          } else {
            console.log('???')
            resolve(0);
            return false;
          }
        })
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
      addVote(payload.voteInfo)
      .then(() => {
        console.log('votedsongstore about to change:', _votedSongs)
        VotedSongStore.emitChange();
      })

    default:
      // do nothing
  }

});

export default VotedSongStore;
