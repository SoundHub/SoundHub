// actions relating to songs/song trees/etc in general

import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

const ActionType = Constants.ActionTypes;

function treeify(nodesArray) {
  var tree;
  // determine root node
  for (var i = 0, j = nodesArray.length; i < j; i++) {
    nodesArray[i].children = [];
    if (!tree) {
      if (nodesArray[i].parentId === null) {
        tree = nodesArray[i];
      }
    }
  }
  // recursively build and traverse tree
  function depthFirstFill(node) {
    if (node) {
      for (var i = 0; i < nodesArray.length; i++) {
        if (nodesArray[i].parentId === node.uuid) {
          node.children.push(nodesArray[i]);
        }
      }
      for (var i = 0; i < node.children.length; i++) {
        depthFirstFill(node.children[i]);
      }
    }
  }
  depthFirstFill(tree);
  return tree;
};

export default {
  playSong(song){
    Dispatcher.dispatch({
      type: ActionType.PLAY,
      song:song
    });
  },
  // retrieve all songs from server
  getAllSongs() {
    Utils.get('/allSongs')
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_SONGS,
        songs: json
      })
    })
    .catch((err) => {
      console.error('failed: ', err)
    })
  },

  getAllSongsSorted(order, page) {
    let data = {
      order: order,
      page: page
    }
    Utils.postJSON('/allSongSort', data)
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_SONGS_SORTED,
        songs: json
      })
    })
    .catch((err) => {
      console.error('failed to sort ', err)
    })
  },

  getAllFavs(userId) {
    var data = {userId: userId}
    Utils.postJSON('/myFavs',data)
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_FAV_SONGS,
        songs: json
      })
    })
    .catch((err) => {
      console.error('failed: ', err)
    })
  },
  addFav(userId,songId) {
    var data = {
      userId:userId,
      songId:songId
    }
    Utils.postJSON('/addFav',data)
    .then((json) => {
      Dispatcher.dispatch({
        type: ActionType.ADD_FAV_SUCCESS,
      })
    })
    .catch((err) => {
      console.error('failed: ', err)
    })
  },
  getSongTree(song) {
    Utils.getTree('/tree', song)
    .then((json) => {
      // Otherwise it just returns an array that the allSongStore can't use
      let retObj = {
        songs: json,
        number: json.length
      };
      // assemble the tree object from the unsorted array
      let assembledTree = treeify(json);
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_SONG_TREE,
        songTree: assembledTree
      })
      // Populate the allSongStore with the songs in the tree
      Dispatcher.dispatch({
        type: ActionType.RECEIVE_ALL_SONGS_SORTED,
        songs: retObj
      })
    })
    .catch((err) => {
      console.error('failed: ', err)
    })
  },

  // add song into database
  addSong(songData) {
    Utils.postJSON('/addSong', songData)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.SONG_ADD_SUCCESS,
        message: 'Song successfully added',
        songData: songData
      });
      console.log('dispatched')
    })
    .catch((err) => {
      console.error('failed', err)
    })
  },

  // find all songs uploaded by user
  getUserCreatedSongs(userId) {
    var data = {userId: userId}
    Utils.postJSON('/mySongs', data)
    .then((userSongs) => {
      Dispatcher.dispatch({
        type: ActionType.GET_USER_SONGS,
        message: 'all user songs dispatch',
        userSongs: userSongs
      });
      console.log(userSongs)
    })
    .catch((err) => {
      console.error('failed: ', err)
    })
  },

  // fork a song
  forkSong(userId, songId) {
    let forkInfo = {
      userId: userId,
      songId: songId
    }
    Utils.simplePost('/addFork', forkInfo)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.FORK_SUCCESS,
        forkInfo: forkInfo
      })
    })
    .catch((err) => {
      console.log('forking failed: ', err)
    })
  },


  // find all songs forked by user
  getAllForks(userId) {
    var obj = {userId: userId};
    Utils.postJSON('/myForks', obj)
    .then((response) => {
      console.log("dispatch forked songs ", response);
      Dispatcher.dispatch({
        type: ActionType.GET_USER_FORKS,
        songs: response
      })
    })
    .catch((err) => {
      console.error('songForks failed: ', err);
    });
  },

  // upload a song related to another node
  createFromFork(forkSong){
    Dispatcher.dispatch({
      type: ActionType.CREATE_FROM_FORKS,
      song: forkSong,
      page: 'create'
    })
  },

  // set newly voted song in votedSongStore
  addNewVotedSong(songData) {
    Dispatcher.dispatch({
      type: ActionType.NEW_SONG_VOTED,
      songData: songData
    })
    return true;
  },

  // add upvote or downvote to song
  addSongVote(userId, songId, value, prev) {
    var voteInfo = {
      userId: userId,
      songId: songId,
      vote: value,
      prev: prev
    }
    Dispatcher.dispatch({
      type: ActionType.VOTE,
      voteInfo: voteInfo
    })
    Utils.simplePost('/addVote', voteInfo)
    .catch((err) => {
      console.error('voting failed: ', err)
    })
  },

  // get songs that user has voted on
  getUserVotes(userId) {
    var data = {userId: userId};
    Utils.postJSON('/myVotes', data)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.GET_USER_VOTES,
        songs: response
      })
    })
    .catch((err) => {
      console.error('getting user votes failed: ', err)
    })
  },

  updateActiveSong(id) {
    Dispatcher.dispatch({
      type: ActionType.ACTIVE_SONG,
      id: id
    })
  },

  openLinkModal(song) {
    let origin = window.location.origin;
    let link = origin + '/tree/' + song.rootId + '&' + song.uuid;
    let msg = link;
    Dispatcher.dispatch({
      type: ActionType.OPEN_LINK_MODAL,
      event: "share",
      id: song,
      message: msg
    })
  }
}
