// all songs, to be displayed on homepage
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import _ from 'lodash';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';
const UPDATE_EVENT = 'update';

var _songs = {
  allSongs: [],
  number: 0
};

var _activeId = null;

let setAllSongs = function (songData) {
  _songs.allSongs = songData.songs;
  _songs.number = songData.number;
};

let setActiveSong = function(song) {
  _activeId = song;
}

var addVote = function(voteInfo) {
  return new Promise((resolve, reject) => {
    var diff = voteInfo.vote - voteInfo.prev;
    _.forEach(_songs.allSongs, (song) => {
      if(song.uuid === voteInfo.songId) {
        song.like += diff;
        resolve(song.like)
        return false;
      }
    })
    reject(Error('nothing found'))
  })
}

let AllSongStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  emitUpdate() {
    this.emit(UPDATE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  addUpdateListener(callback) {
    this.on(UPDATE_EVENT, callback)
  },
  removeUpdateListener(callback) {
    this.removeListener(UPDATE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getAllSongs() {
    return _songs.allSongs;
  },
  getSongNum() {
    return _songs.number;
  },
  getCurrentSong() {
    return _activeId;
  },
  getSongById(uuid) {
    return new Promise((resolve, reject) => {
      var song;
      for(var i=0; i<_songs.allSongs.length; i++) {
        if(_songs.allSongs[i].uuid === uuid) {
          song = _songs.allSongs[i];
          break;
        }
      }
      if(song) {
        resolve(song)
      } else {
        reject(Error('no song found'))
      }
    })
  }
})

AllSongStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.RECEIVE_ALL_SONGS_SORTED:
      let songs = payload.songs;
      setAllSongs(songs);
      AllSongStore.emitChange();
      break;

    case ActionType.VOTE:
      addVote(payload.voteInfo)
      .then(() => {
        AllSongStore.emitChange();
      })
      break;

    case ActionType.SONG_ADD_SUCCESS:
      console.log('song add success');
      break;

    case ActionType.FORK_SUCCESS:
      console.log('fork .. I mean branch success');
      break;

    case ActionType.ACTIVE_SONG:
      let activeId = payload.id.uuid;
      setActiveSong(activeId);
      AllSongStore.emitUpdate();
      break;

    default:
      break;
  }

});

export default AllSongStore;
