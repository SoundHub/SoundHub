'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _alert = {};

var setAlert = function(event) {
  if(event === 'fork') {
    _alert.alert = 'Song forked!'
  } else if(event === 'favorite') {
    _alert.alert = 'Song added to favorites!'
  }
}

var AlertStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getMessage() {
    return _alert.alert;
  }
})

AlertStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.OPEN_ALERT:
      setAlert(payload.event);
      AlertStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AlertStore;
