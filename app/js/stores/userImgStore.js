// store for songs voted by specific user
'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';

var _imgUrl;
let setImgUrl = function(imgURL) {
  _imgUrl = imgURL;
}

var userImgStore = assign({}, EventEmitter.prototype, {
  emitChange() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },
  getImgUrl() {
    return _imgUrl;
  }
})

userImgStore.dispatchToken = Dispatcher.register(function(payload) {

  switch(payload.type) {
    case ActionType.CHANGE_IMG_URL:
      console.log('enter user img store', payload)
      setImgUrl(payload.imgURL);
      userImgStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default userImgStore;
