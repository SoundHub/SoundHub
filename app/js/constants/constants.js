var keyMirror = require('keymirror'); 

// define action constants
var constants = {
    ActionTypes: keyMirror({
      NEW_USER: null,
      LOGIN: null,
      LOGOUT: null,
      RECEIVE_ALL_SONGS: null,
      FORK: null,
      DOWNLOAD: null,
      UPLOAD: null,
      RECEIVE_DATA: null
  })
}

module.exports = constants;