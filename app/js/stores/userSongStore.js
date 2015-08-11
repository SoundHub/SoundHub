// store for user created songs (at root)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

let ActionType = Constants.ActionTypes;
let CHANGE_EVENT = 'change';

let _userSongs = {}; // keys: songsCreated, newestSong

let setNewestSong = function(songData) {
  _userSongs.newestSong = songData;
  console.log(_userSongs);
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
  }

})

UserSongStore.dispatchToken = Dispatcher.register(function(payload) {
  
  switch(payload.type) {    
    case ActionType.SONG_ADD_SUCCESS:
      console.log('enter user song store', payload)
      setNewestSong(payload.songData);   
      UserSongStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default UserSongStore;