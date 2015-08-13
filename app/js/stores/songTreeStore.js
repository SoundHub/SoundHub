// store for song tree info

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

SongTreeStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.RECEIVE_SONG_TREE:
      console.log('enter SongTreeStore');
      let songTree = payload.songTree;
      SongTreeStore.emitChange();
      break;

    default:
      // do nothing
  }
});

export default SongTreeStore;

// ES5
// var Dispatcher = require('../dispatcher/dispatcher.js');
// var Constants = require('../constants/constants');
// var EventEmitter = require('events').EventEmitter;
// var assign = require('object-assign');

// var ActionTypes = Constants.ActionTypes;
// var CHANGE_EVENT = 'change';



// var _songs = {};


// var SongTree = assign({}, EventEmitter.prototype, {

//   emitChange: function () {
//     this.emit(CHANGE_EVENT);
//   },

//   addChangeListener: function(callback) {
//     this.on(CHANGE_EVENT, callback);
//   },

//   removeChangeListener: function(callback) {
//     this.removeListener(CHANGE_EVENT, callback);
//   },

//   get: function(id) {

//   }



// });
