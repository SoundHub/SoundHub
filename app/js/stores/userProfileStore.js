// store for profile components (not including songs)
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

// some fake data
let _user = {
  loggedIn: false,
  userInfo: {
    username: 'algore7',
    userId: 123,
    firstName: 'Al',
    lastName: 'Gore'
  }
};


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
  }

});

UserProfile.dispatchToken = Dispatcher.register(function(payload) {

  switch (payload.type) {
    case ActionType.LOGIN:
      console.log('store login');
      console.log("payload login user: ", payload.user);
      _user.loggedIn = true;

      UserProfile.emitChange();
      break;

    case ActionType.SIGNUP:
      console.log('store signup');
      console.log("payload signup user: ", payload.user);
      _user.loggedIn = true;

      UserProfile.emitChange();
      break; 

    case ActionType.LOGOUT:
      console.log("store logout");
      _user.loggedIn = false;
      
      UserProfile.emitChange();
      break;


    default:
      console.log("default"); 
  }

});

export default UserProfile;
