// handles user/profile info

var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants');

var ActionTypes = Constants.ActionTypes;


module.exports = {
  createUser: function (user) {
    Dispatcher.dispatch({
      type: ActionTypes.NEW_USER,
      user: user


    });
  }
  
}
