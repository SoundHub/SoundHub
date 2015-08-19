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
      Dispatcher.dispatch({
        type: ActionType.SIGNUP,
        response: response,
        user: user
      });
      console.log('user created');
    })
    .catch((err) => {
      console.error('signup failed ', err);
    });
  },

  loginUser (user, cb) {
    Utils.postJSON('/login', user)
    .then((response) => {
      Dispatcher.dispatch({
        type: ActionType.LOGIN,
        message: 'Login successful',
        response: response
      });
      console.log('logged in successfuly');
      console.log(response);
      cb();
    })
    .catch((err) => {
      console.error('login failed: ', err);
    });
  },

  logoutUser (userID) {
    Dispatcher.dispatch({
      type: ActionType.LOGOUT,
      message: 'Logout successful',
    });
  },

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
  },


  changeProfile(url){
    Dispatcher.dispatch({
      type: ActionType.CHANGE_IMG_URL,
      message: 'Change Img url',
      imgURL:url
    });
  },

  updateUsername(userId,newname){
    let obj={
      userId:userId,
      newname:newname
    }
    Utils.postJSON('/updateUsername',obj)
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
  },

  updateImg(userId,imgUrl){
    let obj={
      userId:userId,
      imgUrl:imgUrl
    }
    Utils.postJSON('/updateImg',obj)
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
  },


});
