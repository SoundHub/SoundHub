'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';
var _forkSongCreate = {};
var setForkCreate = function(forkSong){
  _forkSongCreate = forkSong;
}

var ForkedCreateStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getForkCreate(){
    return _forkSongCreate;
  }
})

ForkedCreateStore.dispatchToken = Dispatcher.register(function(payload) {
  switch(payload.type) {
    case ActionType.CREATE_FROM_FORKS:
      console.log('enter user song store', payload)
      setForkCreate(payload.song);
      ForkedCreateStore.emitChange();
      break;


    default:
      // do nothing
  }

});

export default ForkedCreateStore;
