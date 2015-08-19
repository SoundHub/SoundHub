import React from 'react';
import UserProfileStore from '../stores/userProfileStore';
import UserActions from '../actions/userActionCreators';
import RouterActions from '../actions/routerActionCreators';

export default (Component) => {
  return class AuthenticatedComponent extends React.Component {

    static willTransitionTo(transition) {

      console.log('willTransitionTo for AuthenticatedComponent. Going to: ', transition.path, 'logged in: ', UserProfileStore.isLoggedIn())   
      
      if(!UserProfileStore.isLoggedIn()) {
        let transitionPath = transition.path;
        RouterActions.storeRouterTransitionPath(transitionPath);
        transition.redirect('/auth');
      }
    }

    constructor() {
      super();
      this.state = this._getLoginState();
    }

    _getLoginState() {
      return {
        loggedIn: UserProfileStore.isLoggedIn(),
        userId: UserProfileStore.getCookieID(),
        username: UserProfileStore.getCookieName()
      };
    }

    componentDidMount() {
      this._onChange = this._onChange.bind(this);
      UserProfileStore.addChangeListener(this._onChange);
    }

    _onChange() {
      this.setState(this._getLoginState());
    }

    componentWillUnmount() {
      UserProfileStore.removeChangeListener(this._onChange);
    }

    render() {
      return (
      <Component
        {...this.props}
        userId={this.state.userId}
        username={this.state.username}
        loggedIn={this.state.loggedIn} />
      );
    }
  }
}