// store for user created songs (at root)

var Dispatcher = require('../dispatcher/dispatcher.js');
var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

