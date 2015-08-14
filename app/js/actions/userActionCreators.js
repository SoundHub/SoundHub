// handles user/profile info
'use strict';
import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

let ActionType = Constants.ActionTypes;


export default ({    

  createUser (user) {
    // let userData = {
    //   username: user.username,
    //   password: user.password,
    //   email: user.email
    // };

    Utils.post('/signup', user) 
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.SIGNUP,
        user: user
      });
      console.log('user created');
    })
    .catch((err) => {
      console.error('signup failed ', err);
    });
  },

  loginUser (user) {
    // user = {
    //   userName: user.username,
    //   password: user.password
    // };

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
  
});
