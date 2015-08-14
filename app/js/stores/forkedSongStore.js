'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _forkedSongs = {
  all: []
}

var setUserForks = function(forks) {
  console.log('set user forks: ',forks)
  _forkedSongs.all = forks;
  console.log('user songs: ', _forkedSongs.all)
}

var ForkedSongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getForkedSongs() {
    console.log('store getter: ', _forkedSongs.all)
    return _forkedSongs.all;
  }
})

ForkedSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.GET_USER_FORKS:
      setUserForks(payload.songs);
      ForkedSongStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ForkedSongStore;
