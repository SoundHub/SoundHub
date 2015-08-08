// actions relating to songs/song trees/etc in general

import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

let ActionTypes = Constants.ActionTypes;

export default {
  getAllSongs() {
    Utils.get('/allSongs')
    .then((response) => {
      console.log(response.status);
    })
    // Dispatcher.dispatch({
    //   type: ActionTypes.RECEIVE_ALL_SONGS,

    // })

  }
} 