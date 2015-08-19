import Dispatcher from '../dispatcher/dispatcher.js';
import ActionType from '../constants/constants';

export default {
  storeRouterTransitionPath: (path) => {
    Dispatcher.dispatch({
      type: ActionType.ROUTER_NEXT_TRANSITION_PATH,
      path: path
    })
  }
}