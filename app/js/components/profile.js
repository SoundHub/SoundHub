'use strict';
import React from 'react';

class Profile extends React.Component {
  render() {
    return (
      <div className="Profile">
        <div className="pageTitle">Profile</div>
        <div>Profile picture</div>
        <div className="edit-profile">
          <div>Name</div>
          <input size="20" type="text" placeholder=" Username " ></input>
        </div>
        <button className="btn btn-success">SAVE</button>
      </div>

    );
  }
}

export default Profile;
