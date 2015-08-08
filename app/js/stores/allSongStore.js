// all songs, to be displayed on homepage

var Dispatcher = require('../dispatcher/dispatcher.js');
var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');



var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _songs = {};

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
