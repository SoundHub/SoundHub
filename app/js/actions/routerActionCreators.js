import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants';

let ActionType = Constants.ActionTypes;

export default {
  storeRouterTransitionPath(path) {
    Dispatcher.dispatch({
      type: ActionType.ROUTER_NEXT_TRANSITION_PATH,
      path: path
    })
  },

  openLoginRemindModal() {
    Dispatcher.dispatch({
      type: ActionType.OPEN_LOGIN_REMIND_MODAL
    })
  },

  openLoginModal() {
    Dispatcher.dispatch({
      type: ActionType.OPEN_LOGIN_MODAL
    })
  },

  closeLoginModal(){
    Dispatcher.dispatch({
      type: ActionType.CLOSE_LOGIN_MODAL
    })
  },

  alertUserAction(event) {
    Dispatcher.dispatch({
      type: ActionType.OPEN_ALERT,
      event: event
    })
  },

  openUserActionModal(event) {
    Dispatcher.dispatch({
      type: ActionType.OPEN_USER_ACTION_MODAL,
      event: event
    })
  }
}