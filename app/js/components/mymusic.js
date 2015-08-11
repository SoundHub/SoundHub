'use strict';
import React from 'react';
import {Glyphicon} from 'react-bootstrap';

var arr = [{
  title:'song1',
  url:'www.song.com'
},{
  title:'song2',
  url:'www.sogdfg.com'
}]


class ForkList extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>Branches</div>
    );
  }
}


class MyList extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>MyList</div>
    );
  }
}

class Edit extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>MyProfile</div>
    );
  }
}


class Profile extends React.Component {
  render() {
    return (
      <div className="profilePage">
        <img className='randomBG' src="../assets/random-bg/13772829224_76f2c28068_h.jpg"></img>
        <img className='profileImg' src = "../assets/placeholder.jpg"></img>
        <button className="profileButton"><Glyphicon glyph='music' /> MyMusic</button>
        <button className="profileButton"><Glyphicon glyph='paperclip' /> Branches</button>
        <button className="profileButton"><Glyphicon glyph='heart' /> Favourites</button>
        <button className="profileButton"><Glyphicon glyph='user' /> Profile</button>
      </div>
    );
  }
}






export default Profile;
