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
  loggedIn: true,
  userInfo: {
    username: 'algore7',
    userId: 1,
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

export default UserProfile;