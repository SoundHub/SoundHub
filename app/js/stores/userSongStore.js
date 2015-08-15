// store for user created songs (at root)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import AllSongStore from './allSongStore.js'

let ActionType = Constants.ActionTypes;
let CHANGE_EVENT = 'change';

let _userSongs = {
  allCreated: [],
  newestCreated: {},
  voted: {},
  forked: [],
  favs: {}
};

// keys: allCreated, newestCreated, forked, voted, favs

let setNewestCreated = function(songData) {
  _userSongs.newestCreated = songData;
  console.log(_userSongs);
}

let setUserSongs = function(userSongs) {
  _userSongs.allCreated = userSongs;
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

let setUserForks = function(forks) {
  console.log('set user forks: ',forks)
  _userSongs.forked = forks;
  console.log('user songs: ', _userSongs.forked)
}

let setNewFork = function(id) {
  AllSongStore.getSongById(id)
  .then((song) => {
    _userSongs.forked.push(song);
    console.log('forked song: ', _userSongs.forked)
  }, (err) => {
    console.log(err);
  })
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
  getUserCreatedSongs() {
    return _userSongs;
  },
  getSongVote(songId) {
    return _userSongs.voted.songId;
  },
  canVote(songId) {
    return _userSongs.voted[songId].userVoted;
  },
  getForkedSongs() {
    console.log('store getter: ', _userSongs.forked)
    return _userSongs.forked;
  }
})

UserSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.SONG_ADD_SUCCESS:
      console.log('enter user song store', payload)
      setNewestCreated(payload.songData);
      UserSongStore.emitChange();
      break;

    case ActionType.GET_USER_SONGS:
      console.log('enter user song store', payload)
      setUserSongs(payload.userSongs);
      UserSongStore.emitChange();
      break;

    case ActionType.VOTE:
      console.log('enter user song store', payload)
      setVote(payload.voteInfo);
      UserSongStore.emitChange();
      break;

    case ActionType.FORK_SUCCESS:
      Dispatcher.waitFor([AllSongStore.dispatchToken]);
      console.log(payload);
      setNewFork(payload.forkInfo.songId);
      UserSongStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default UserSongStore;
