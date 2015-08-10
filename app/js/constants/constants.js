import keyMirror from 'keyMirror';

let constants = {
    ActionTypes: keyMirror({
      SIGNUP: null,
      LOGIN: null,
      LOGOUT: null,
      RECEIVE_ALL_SONGS: null,
      FORK: null,
      DOWNLOAD: null,
      UPLOAD: null,
      RECEIVE_SONG_TREE: null,
      CREATE_SONG: null,
      SONG_ADD_SUCCESS: null
  })
}

export default constants;