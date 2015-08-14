// handles user/profile info
'use strict';
import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/utils';

let ActionTypes = Constants.ActionTypes;

export default {
  createUser (user) {
    Utils.post('/signup', user)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionTypes.NEW_USER,
        user: user
      });
      console.log('user created');
    });
    .catch((err) => {
      console.error('signup failed ', err);
    })
  },

  loginUser (userName, password) {
    Utils.post('/login', userID, songID)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGIN,
        message: 'Login successful',
        songData: songData
      });
      console.log('logged in successfuly');

    })
    .catch((err) => {
      console.error('login failed: ', err)
    })
  },

  logoutUser (userName) {
    Utils.post('/logout', userID, songID)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGOUT,
        message: 'Logout successful',
        songData: songData
      });
      console.log('logged out successfuly');

    })
    .catch((err) => {
      console.error('logout failed: ', err)
    })
  }
  
}
