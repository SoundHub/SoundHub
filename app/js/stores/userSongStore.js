// store for user created songs (at root)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

let ActionType = Constants.ActionTypes;
let CHANGE_EVENT = 'change';

let _userSongs = {
  allCreated: [],
  voted: {}
}; // keys: allCreated, newestCreated, forked, voted, favs

let setNewestCreated = function(songData) {
  _userSongs.newestCreated = songData;
  console.log(_userSongs);
}

let setVote = function(voteInfo) {
  let songId = voteInfo.songId;
  let songVoteInfo = _userSongs.voted[songId];
  if(!songVoteInfo) {
    _userSongs.voted[songId] = {}
    _userSongs.voted[songId].val = voteInfo.value;
    _userSongs.voted[songId].userVoted = true;
    console.log('voted', _userSongs.voted[songId])
    return;
  } else {
    let newVote = songVoteInfo.val + voteInfo.value;
    if(Math.abs(newVote) === 1 || newVote === 0) {
      _userSongs.voted[songId].val += voteInfo.value;
      _userSongs.voted[songId].userVoted = true;
      console.log('voted', _userSongs.voted[songId])
    } else {
      _userSongs.voted[songId].userVoted = false;
      return;
    }
  } 
}

let UserSongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getUserSongs() {
    return _userSongs;
  },
  getSongVote(songId) {
    return _userSongs.voted.songId;
  },
  canVote(songId) {
    return _userSongs.voted[songId].userVoted;
  }
})

UserSongStore.dispatchToken = Dispatcher.register(function(payload) {
  
  switch(payload.type) {    
    case ActionType.SONG_ADD_SUCCESS:
      console.log('enter user song store', payload)
      setNewestCreated(payload.songData);   
      UserSongStore.emitChange();
      break;

    case ActionType.VOTE:
      console.log('enter user song store', payload)
      setVote(payload.voteInfo);
      break;

    default:
      // do nothing
  }

});

export default UserSongStore;