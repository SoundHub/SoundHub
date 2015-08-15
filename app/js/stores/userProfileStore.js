// store for profile components (not including songs)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

<<<<<<< HEAD


=======
>>>>>>> refactor(userStore): clean up
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
  getCookieID() {
    var name = 'id=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  },
  getCookieName() {
    var name = 'username=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }
});

var setCookie = function (id, username) {
  console.log("cookie contents ", id, username);
  // var expires = "expires="+d.toUTCString();
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
      console.log('store login');
      console.log("response ", payload);
      console.log("should say success", payload.response.success);
      if (payload.response.success) {
        setCookie(payload.response.user[0].id, payload.response.user[0].username);
      }
      else {
        //todo need do diplay on component
        console.log("login failed, user does not exist");
      }
<<<<<<< HEAD
=======

      console.log(_user);

      // console.log("cookie:", getCookieID('id));
      // console.log("cookie:", getCookieName('username'));


>>>>>>> refactor(userStore): clean up
      UserProfile.emitChange();
      break;

    case ActionType.SIGNUP:
      console.log('store signup');
      console.log(payload);
      console.log("payload signup user: ", payload.user);
      console.log("response ", payload);
      console.log("user", payload.user);
      console.log("should say success", payload.response.success);

      if (payload.response.success) {

        _user.loggedIn = true;
        _user.userInfo.username = payload.user.username;
        console.log(_user);
      }

      else {
        console.log("signup failed, user already exists");
        // todo: display this on page
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
