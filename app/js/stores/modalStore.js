// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';
const OPEN_EVENT = 'open';
const USER_ACTION = 'userAction';
const CREATE = 'create';
const USER_SHARE = 'share';

const _actions = {};

var setAction = function(event, message) {
  if(event === 'fork') {
    _actions.action = 'Song forked!'
  } else if(event === 'favorite') {
    _actions.action = 'Song added to favorites!'
  } else if(event === 'share') {
    _actions.action = message;
  }
}

var setSong = function(song) {
  _actions.songCreated = song;
}

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
  },

  // for user action modals
  emitAction() {
    this.emit(USER_ACTION)
  },
  addActionListener(callback) {
    this.on(USER_ACTION, callback)
  },
  removeActionListener(callback) {
    this.removeListener(USER_ACTION, callback)
  },

  // for user share modal
  emitShare() {
    this.emit(USER_SHARE)
  },
  addShareListener(callback) {
    this.on(USER_SHARE, callback)
  },
  removeShareListener(callback) {
    this.removeListener(USER_SHARE, callback)
  },

  getActionMessage() {
    return _actions.action;
  },

  // for song upload
  emitCreate() {
    this.emit(CREATE)
  },
  addCreateListener(callback) {
    this.on(CREATE, callback)
  },
  removeCreateListener(callback) {
    this.removeListener(CREATE, callback)
  },
  getSongCreated() {
    return _actions.songCreated.title;
  }
})


ModalStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.CLOSE_LOGIN_MODAL:
      ModalStore.emitChange();
      break;

    case ActionType.OPEN_LOGIN_MODAL:
      ModalStore.emitOpen();
      break;

    case ActionType.OPEN_USER_ACTION_MODAL:
      setAction(payload.event);
      ModalStore.emitAction();
      break;

    case ActionType.CREATE_SONG:
      setSong(payload.song);
      ModalStore.emitCreate();
      break;
      
    case ActionType.OPEN_LINK_MODAL:
      setAction(payload.event, payload.message);
      ModalStore.emitShare();
      break;

    default:
      // do nothing
  }

});

export default ModalStore;
