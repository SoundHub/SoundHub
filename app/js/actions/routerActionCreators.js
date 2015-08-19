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

  openAuthModal() {
    Dispatcher.dispatch({
      type: ActionType.OPEN_AUTH_MODAL
    })
  }
}