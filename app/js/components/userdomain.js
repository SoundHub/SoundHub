'use strict';
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import {SongList} from './home';
import Router from 'react-router';
import AudioPlayer from './player-components/AudioPlayer';

var arr = [{
  title:'badboy',
  url: "assets/badboy.mp3",
  author:"big bang",
  like:"223"
},{
  title:'bang bang bang',
  url: "assets/bang.mp3",
  author:"big bang",
  like:"53"
},{
  title:'tonight',
  url: "assets/giveyouup.mp3",
  author:"big bang",
  like:"103"
}];


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
    this.switchSong = this.switchSong.bind(this);
  }

  switchSong(song){
    this.props.switchsong(song)
  }

  render() {
    return (
      <div className="mylist">
        <SongList data = {arr}  switchSong = {this.switchSong} />
      </div>
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
    this.setsong = this.setsong.bind(this);
    this.state = {
      pageType: props.pageType,
      currentsong: {}
    }
   }

   gotoMusic(){this.setState({pageType:'music'});}
   gotoBranches(){this.setState({pageType:'branch'});}
   gotoFavourites(){ this.setState({pageType:'fav'}); }
   gotoProfile(){ this.setState({pageType:'profile'}); }
   setsong(song){ this.setState({currentsong:song}); }

  render() {
    var profilePage = <MyMusic switchsong = {this.setsong}/>;
    if(this.state.pageType==='music'){
      profilePage = <MyMusic switchsong = {this.setsong}/>
    }else if(this.state.pageType==='branch'){
      profilePage = <ForkList />
    }else if(this.state.pageType==='fav'){
      profilePage = <Favor />
    }else if(this.state.pageType==='profile'){
      profilePage = <Edit />
    }

    return (
      <div className="profilePage">
      <AudioPlayer song = {this.state.currentsong} mode = "user" />
        <img className='randomBG' src="../assets/random-bg/13772829224_76f2c28068_h.jpg"></img>
        <img className='profileImg' src = "../assets/placeholder.jpg"></img>
        <div className="profileButtonCollection">
          <button className="profileButton" onClick={this.gotoMusic}><Glyphicon glyph='music'  /> MyMusic</button>
          <button className="profileButton" onClick={this.gotoBranches}><Glyphicon glyph='paperclip' onClick={this.gotoBranches} /> Branches</button>
          <button className="profileButton" onClick={this.gotoFavourites}><Glyphicon glyph='heart' /> Favourites</button>
          <button className="profileButton" onClick={this.gotoProfile}><Glyphicon glyph='user' /> Profile</button>
          <Router.Link to="create">
            <button className="profileButton"><Glyphicon glyph='upload' /> Create</button>
          </Router.Link>
        </div>
        {profilePage}
      </div>
    )
  }

}

export default User;
