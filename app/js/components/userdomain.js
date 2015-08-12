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


class MyMusic extends React.Component {
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

class Favor extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>Favorite</div>
    );
  }
}


class User extends React.Component {
  constructor(props) {
    super(props);
    this.gotoMusic = this.gotoMusic.bind(this);
    this.gotoBranches = this.gotoBranches.bind(this);
    this.gotoFavourites = this.gotoFavourites.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.state = {pageType: props.pageType}
   }

   gotoMusic(){this.setState({pageType:'music'});}
   gotoBranches(){this.setState({pageType:'branch'});}
   gotoFavourites(){ this.setState({pageType:'fav'}); }
   gotoProfile(){ this.setState({pageType:'profile'}); }

  render() {
    var profilePage = <MyMusic />;
    if(this.state.pageType==='music'){
      profilePage = <MyMusic />
    }else if(this.state.pageType==='branch'){
      profilePage = <ForkList />
    }else if(this.state.pageType==='fav'){
      profilePage = <Favor />
    }else if(this.state.pageType==='profile'){
      profilePage = <Edit />
    }

    return (
      <div className="profilePage">
        <img className='randomBG' src="../assets/random-bg/13772829224_76f2c28068_h.jpg"></img>
        <img className='profileImg' src = "../assets/placeholder.jpg"></img>
        <div className="profileButtonCollection">
          <button className="profileButton" onClick={this.gotoMusic}><Glyphicon glyph='music'  /> MyMusic</button>
          <button className="profileButton" onClick={this.gotoBranches}><Glyphicon glyph='paperclip' onClick={this.gotoBranches} /> Branches</button>
          <button className="profileButton" onClick={this.gotoFavourites}><Glyphicon glyph='heart' /> Favourites</button>
          <button className="profileButton" onClick={this.gotoProfile}><Glyphicon glyph='user' /> Profile</button>
        </div>
        {profilePage}
      </div>
    )
  }

}

export default User;
