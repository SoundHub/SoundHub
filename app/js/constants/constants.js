import keyMirror from 'keymirror';

let constants = {
    ActionTypes: keyMirror({
      PLAY:null,
      SIGNUP: null,
      LOGIN: null,
      LOGOUT: null,
      RECEIVE_ALL_SONGS: null,
      FORK: null,
      DOWNLOAD: null,
      UPLOAD: null,
      RECEIVE_SONG_TREE: null,
      CREATE_SONG: null,
      SONG_ADD_SUCCESS: null,
      VOTE: null,
      GET_USER_FORKS: null,
      GET_USER_SONGS: null,
      FORK_SUCCESS: null,
      CREATE_FROM_FORKS: null,
      GET_USER_VOTES: null,
      NEW_SONG_VOTED: null,
      CHANGE_IMG_URL:null,
      ROUTER_NEXT_TRANSITION_PATH: null,
      RECEIVE_ALL_FAV_SONGS:null,
      ADD_FAV_SUCCESS:null,
      OPEN_AUTH_MODAL: null,
      CLOSE_LOGIN_MODAL:null
  })
};

export default constants;
