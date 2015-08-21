'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';


var AlertStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
})

AlertStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.NEW_ALERT:

      AlertStore.emitChange();
      break;


    default:
      // do nothing
  }

});

export default AlertStore;
