// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';
const OPEN_EVENT = 'open';

var ModalStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  // event for when modal open is triggered
  emitOpen() {
    this.emit(OPEN_EVENT)
  },
  addOpenListener(callback) {
    this.on(OPEN_EVENT, callback)
  },
  removeOpenListener(callback) {
    this.removeListener(OPEN_EVENT, callback)
  }
})

ModalStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.CLOSE_LOGIN_MODAL:
      ModalStore.emitChange();
      break;

    case ActionType.OPEN_LOGIN_MODAL:
      ModalStore.emitOpen();


    default:
      // do nothing
  }

});

export default ModalStore;
