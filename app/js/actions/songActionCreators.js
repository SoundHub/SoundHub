// actions relating to songs/song trees/etc in general

import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

let ActionType = Constants.ActionTypes;

export default {

  // retrieve all songs from server
  getAllSongs() {
    Utils.get('/allSongs')
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log("dispatch songs ", json);
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_SONGS,
        songs: json
      })
    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  // retrieve song tree
  getSongTree(song) {
    Utils.get('/tree', song)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_SONG_TREE,
        songTree: json
      })
    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  // add song into database
  addSong(songData) {
    Utils.post('/addSong', songData)
    .then((response) => {

    })
    .catch((err) => {
      console.log('failed', err)
    })
  },

  // find all songs uploaded by user
  getUserCreatedSongs(user) {
    Utils.post('/mySongs', user)
    .then((response) => {

    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  },

  // find all songs forked by user
  getUserForkedSongs(user) {
    Utils.post('/myForks', user)
    .then((response) => {

    })
    .catch((err) => {
      console.log('failed: ', err)
    })
  }
} 