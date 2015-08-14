// store for song tree info

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _tree = {stuff: 'stuff'};

var setTree = function (tree) {
  _tree = tree;
};

var SongTreeStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getTree() {
    return _tree;
  }

});

SongTreeStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.RECEIVE_SONG_TREE:
      let songTree = payload.songTree;
      setTree(songTree);
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
