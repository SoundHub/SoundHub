// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _song;

var setPlaySongs = function(song) {
  _song = song;
}

var PlaySongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getSong() {
    console.log('return song')
    console.log(_song);
    return _song;
  },
})

PlaySongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.PLAY:
      setPlaySongs(payload.song)
      PlaySongStore.emitChange();
      break;
    default:
      // do nothing
  }

});

export default PlaySongStore;
