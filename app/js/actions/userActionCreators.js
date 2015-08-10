// handles user/profile info

import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/utils';

let ActionTypes = Constants.ActionTypes;


export default {
  createUser: function (user) {
    Dispatcher.dispatch({
      type: ActionTypes.NEW_USER,
      user: user

    });
  }
  
}
