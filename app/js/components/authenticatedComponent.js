import React from 'react';
import UserProfileStore from '../stores/userProfileStore';
import UserActionCreators from '../actions/userActionCreators';

export default (Component) => {
  return class AuthenticatedComponent extends React.Component {

    static willTransitionTo(transition) {

      console.log('willTransitionTo for AuthenticatedComponent. Going to: ', transition.path, 'logged in: ', UserProfileStore.isLoggedIn())
    
      if(!UserProfileStore.isLoggedIn()) {

        let transitionPath = transition.path;

        
      }
    }
  }
}