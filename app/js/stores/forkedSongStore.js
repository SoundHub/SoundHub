'use strict';

import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';
import EventEmitter from 'events';
import assign from 'object-assign';

const ActionType = Constants.ActionTypes;
const CHANGE_EVENT = 'change';


// _forkedSongs = {}

// setter functions
// example: createFork -> set obj in _forked obj

// let ForkedSongStore = { methods : changes, add/remove listerner, getters}

// dispatch token