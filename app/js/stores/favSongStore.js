// all songs, to be displayed on homepage
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'lodash';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _favSongs = [];

let setAllFavSongs = function (songs) {
  _favSongs = songs;
};


let FavSongStore = assign({}, EventEmitter.prototype, {
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
    return _favSongs;
  }
})

FavSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.RECEIVE_ALL_FAV_SONGS:
      let songs = payload.songs;
      setAllFavSongs(songs);
      FavSongStore.emitChange();
      break;

    case ActionType.ADD_FAV_SUCCESS:
      console.log('add fav success!')
      FavSongStore.emitChange();
      break;


    default:
      // do nothing
  }

});

export default FavSongStore;
