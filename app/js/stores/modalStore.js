// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';


var ModalStore = assign({}, EventEmitter.prototype, {
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

ModalStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.CLOSE_LOGIN_MODAL:
      ModalStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ModalStore;
