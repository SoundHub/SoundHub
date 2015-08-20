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
  isLoggedIn() {
    return !!this.getCookieID();
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
  },
  getCookieImg() {
    var name = 'img=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }
});


var setCookie = function (id, username, img) {
  if (id !== null) {
    document.cookie = "id" + "=" + id;
  }
  if (username !== null) {
    document.cookie = "username" + "=" + username;
  }
  if (img !== null) {
    document.cookie = "img" + "=" + img;
  }
};

var deleteCookie = function() {
  document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "img=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};

UserProfile.dispatchToken = Dispatcher.register(function(payload) {

  switch (payload.type) {
    case ActionType.LOGIN:
      if (payload.response.success) {
        let id = payload.response.user[0].id;
        let username = payload.response.user[0].username;
        let img = payload.response.user[0].profilePic;
        setCookie(id,username,img);
      } else {
        console.log("login failed, user does not exist");
      }
      UserProfile.emitChange();
      break;

    case ActionType.SIGNUP:
      if (payload.response.success) {
        console.log('signup success');
        let id = payload.response.userData.id;
        let username = payload.response.userData.username;
        let img = payload.response.userData.profilePic;
        setCookie(id, username, img);
        UserProfile.emitChange();

      } else {
        console.log("signup failed, user already exists");
      }
      break;

    case ActionType.LOGOUT:
      console.log("store logout");
      deleteCookie();
      UserProfile.emitChange();
      break;

    case ActionType.UPDATE:
      let username = payload.response.newname;
      let imgUrl = payload.response.imgUrl;
      setCookie(null, username, imgUrl);
      UserProfile.emitChange();
      break;

    default:
  }

});

export default UserProfile;
