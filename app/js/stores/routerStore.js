'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var RouterStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getNextTransitionPath() {
    let nextPath = this._nextRouterPath;
    this._nextRouterPath = null;
    return nextPath;
  }
})

RouterStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.ROUTER_NEXT_TRANSITION_PATH:
      console.log('enter router next transition', payload)
      this._nextRouterPath = payload.path;
      break;

    default:
      break;
  }

});

export default RouterStore;
