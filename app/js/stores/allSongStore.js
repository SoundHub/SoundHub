// all songs, to be displayed on homepage
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionTypes = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

let _songs = {};

var setAllSongs = function (songs) {
  _songs.allSongs = songs;
};

let AllSongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getAllSongs() {
    return _songs;
  }

})

AllSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    
    case ActionTypes.RECEIVE_ALL_SONGS:
      let songs = payload.songs;
      setAllSongs(songs);      
      AllSongStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AllSongStore;
