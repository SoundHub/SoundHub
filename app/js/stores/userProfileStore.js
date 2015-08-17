// store for profile components (not including songs)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';


var _user = {};

let UserProfile = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  getLoggedInUser() {
    return _user.userInfo;
  },

  getCookieID() {
    let name = 'id=';
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return 0;
  },
  getCookieName() {
    let name = 'username=';
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }
});


var setCookie = function (id, username) {
  //console.log("cookie contents ", id, username);
  document.cookie = "id" + "=" + id;
  document.cookie = "username" + "=" + username;
};

var deleteCookie = function() {
  document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};

UserProfile.dispatchToken = Dispatcher.register(function(payload) {

  switch (payload.type) {
    case ActionType.LOGIN:

      if (payload.response.success) {
        setCookie(payload.response.user[0].id, payload.response.user[0].username);
      }
      else {
        //todo need do diplay on component
        console.log("login failed, user does not exist");
      }

      UserProfile.emitChange();
      break;

    case ActionType.SIGNUP:
      if (payload.response.success) {
        _user.loggedIn = true;
        _user.userInfo.username = payload.user.username;
        console.log(_user);
      }else {
        console.log("signup failed, user already exists");
      }
      UserProfile.emitChange();
      break;

    case ActionType.LOGOUT:
      console.log("store logout");
      deleteCookie();
      UserProfile.emitChange();
      break;

    default:
      //dont do anying
  }

});

export default UserProfile;
