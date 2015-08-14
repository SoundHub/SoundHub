// all songs, to be displayed on homepage
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';
import UserSongStore from './userSongStore';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

let _songs = {};

let setAllSongs = function (songs) {
  _songs.allSongs = songs;
};

let addVote = function(voteInfo) {
  if(UserSongStore.canVote(voteInfo.songId)) {
    _songs.allSongs.forEach(function(song) {
      if(song.id === voteInfo.songId) {
        song.like += voteInfo.value;
        console.log('after vote: ', song)
      }
    })
  }
}

var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // this will throw, x does not exist
    resolve(x + 2);
  });
};

// let addForkNum = function(id) {
//   return new Promise((resolve, reject) => {
//     _songs.allSongs.forEach((song) => {
//       if(song.id === id) {
//         console.log('fork num added: ', song);
//         song.forks++;
//         console.log('addForkNum: ', song)
//         resolve(song)
//       } else {
//         reject(Error('no song found'))
//       }
//     })
//   })
// }

let addForkNum = function(id) {
  console.log(id)
  _songs.allSongs.forEach((song) => {
    if(song.id === id) {
      console.log('fork num added: ', song);
      song.forks++;
      console.log('addForkNum: ', song)
    }
  })
}

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
  },
  getSongById(id) {
    return new Promise((resolve, reject) => {
      console.log('id ', id)
      var song;
      for(var i=0; i<_songs.allSongs.length; i++) {
        if(_songs.allSongs[i].id === id) {
          console.log('entering if')
          song = _songs.allSongs[i];
          break; //NOTE: you can't break out of a forEach :(
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
    case ActionType.RECEIVE_ALL_SONGS:
      console.log('enter AllSongStore')
      let songs = payload.songs;
      setAllSongs(songs);
      AllSongStore.emitChange();
      break;

    case ActionType.VOTE:
      Dispatcher.waitFor([UserSongStore.dispatchToken]);
      console.log(UserSongStore.dispatchToken)
      addVote(payload.voteInfo);
      AllSongStore.emitChange();
      break;

    case ActionType.SONG_ADD_SUCCESS:
      console.log('song add success');
      break;

    case ActionType.FORK_SUCCESS:
      addForkNum(payload.forkInfo.songId)
      AllSongStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AllSongStore;
