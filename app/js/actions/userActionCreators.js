// handles user/profile info
'use strict';
import Dispatcher from '../dispatcher/dispatcher';
import Constants from '../constants/constants';
import Utils from '../utils/appUtils';

let ActionType = Constants.ActionTypes;


export default ({

  createUser (user) {
    Utils.postJSON('/signup', user)
    .then((response) => {
      // console.log(response);
      // var resp = JSON.parse(response.body);
      // console.log(resp);
      // return resp
      // .then ((resp) => {
        Dispatcher.dispatch({
          type: ActionType.SIGNUP,
          response: response,
          user: user
        });
        console.log('user created');
      // });
    })
    .catch((err) => {
      console.error('signup failed ', err);
    });
  },

  loginUser (user) {
    console.log('login');
    Utils.postJSON('/login', user)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGIN,
        message: 'Login successful',
        response: response
      });
      console.log('logged in successfuly');
    })
    .catch((err) => {
      console.error('login failed: ', err);
    });
  },

  logoutUser (userID) {
    Utils.simplePost('/logout', userID)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGOUT,
        message: 'Logout successful',
        response: response
      });
      console.log('logged out successfuly');
    })
    .catch((err) => {
      console.error('logout failed: ', err);
    });
  }

  getUser(userID){
    Utils.postJSON('/getuser',userID)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.GET_USER,
        message: 'Get user info',
        response: response
      });
      console.log('get userinfo successfuly');
    }).catch((err) => {
      console.error('get userinfo failed: ', err);
    });
  }


});
