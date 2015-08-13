// handles user/profile info
'use strict';
import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/utils';

let ActionType = Constants.ActionTypes;

export default {
  createUser (userName, password, email = "") {
    let user = {
      userName: userName,
      password: password,
      email: email
    };
    Utils.post('/signup', user)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.NEW_USER,
        user: user
      });
      console.log('user created');
    })
    .catch((err) => {
      console.error('signup failed ', err);
    });
  },

  loginUser (userName, password) {
    let user = {
      userName: userName,
      password: password

    };
    Utils.post('/login', user)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGIN,
        message: 'Login successful',
        user: user
      });
      console.log('logged in successfuly');

    })
    .catch((err) => {
      console.error('login failed: ', err);
    });
  },

  logoutUser (userID) {
    Utils.post('/logout', userID)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGOUT,
        message: 'Logout successful',
        user: userID
      });
      console.log('logged out successfuly');
    })
    .catch((err) => {
      console.error('logout failed: ', err);
    });
  }
  
};
