'use strict';
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import SongList from './songlist';
import Edit from './editprofile';
import Create from './create';
import Router from 'react-router';
import AudioPlayer from './player-components/AudioPlayer';

import SongActions from '../actions/songActionCreators';
import UserActions from '../actions/userActionCreators';

import FavSongStore from '../stores/favSongStore';
import AllSongStore from '../stores/allSongStore';
import UserSongStore from '../stores/userSongStore';
import UserImgStore from '../stores/userImgStore';
import UserProfileStore from '../stores/userProfileStore';
import ForkedSongStore from '../stores/forkedSongStore';
import ForkedCreateStore from '../stores/forkedCreateStore';
import PlaySongStore from '../stores/playSongStore';
import AuthenticatedComponent from './authenticatedComponent';

class ForkList extends React.Component {
  constructor() {
    super();
    this.state = {forkedSongs: []};
    this._onChange = this._onChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
  }

  componentDidMount() {
    ForkedSongStore.addChangeListener(this._onChange);
    SongActions.getAllForks(this.props.userId);
    AllSongStore.addUpdateListener(this._onUpdate);
  }

  componentWillUnmount() {
    ForkedSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeUpdateListener(this._onUpdate);
  }

  playsong(){
    this.setState({currentsong:PlaySongStore.getSong()});
  }


  _onChange() {
    console.log("I'm trying here");
    this.setState({forkedSongs: ForkedSongStore.getForkedSongs()});
  }

  _onUpdate() {
    console.log('potato');
    if(this.state.activeSong === AllSongStore.getCurrentSong()){
      this.setState({activeSong: null});
    }else{
      this.setState({activeSong: AllSongStore.getCurrentSong()});
    }
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Branches</div>
          {
            this.state.forkedSongs.length ?
            <div className="mylist">
              <SongList data = {this.state.forkedSongs} page='fork' activeSong = {this.state.activeSong} />
            </div>:
            <div>
              Press the <Glyphicon glyph='leaf' /> on any song to create a new branch
            </div>
          }

      </div>
    );
  }

}

class MyMusic extends React.Component {
  constructor() {
    super();
    this.state = {userSongs: []};
    this.componentDidMount = this.componentDidMount.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
  }

  _onUpdate() {
    console.log('update in component');
    this.setState({activeSong: AllSongStore.getCurrentSong()});
  }

  componentWillMount() {
    UserSongStore.addChangeListener(this._onChange);
    SongActions.getUserCreatedSongs(this.props.userId);
  }
  
  componentDidMount() {
    AllSongStore.addUpdateListener(this._onUpdate);
  }

  componentWillUnmount() {
    UserSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeUpdateListener(this._onUpdate);
  }

  _onChange() {
    this.setState({userSongs: UserSongStore.getUserCreatedSongs().allCreated});
  }

  _onUpdate() {
    console.log('potato');
    if(this.state.activeSong === AllSongStore.getCurrentSong()){
      this.setState({activeSong: null});
    }else{
      this.setState({activeSong: AllSongStore.getCurrentSong()});
    }
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">MyMusic</div>
          {
            this.state.userSongs.length ?
            <div className="mylist">
              <SongList data = {this.state.userSongs} page='mymusic' activeSong = {this.state.activeSong} />
            </div>:
            <div>
              Upload a new song from '<Glyphicon glyph='upload' />Create' page
            </div>
          }

      </div>
    );
  }
}



class Favor extends React.Component {
  constructor() {
    super();
    this.state = {favSongs: []};
    this.activeSong = null;
    this.componentDidMount = this.componentDidMount.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
  }
  componentDidMount() {
    AllSongStore.addUpdateListener(this._onUpdate);
    SongActions.getAllFavs(this.props.userId);
    FavSongStore.addChangeListener(this._onChange);
  }
  componentWillUnmount() {
    FavSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeChangeListener(this._onChange);
    AllSongStore.removeUpdateListener(this._onUpdate);
  }

  _onChange() {
    this.setState({favSongs: FavSongStore.getAllSongs()});
  }

  _onUpdate() {
    console.log('potato');
    if(this.state.activeSong === AllSongStore.getCurrentSong()){
      this.setState({activeSong: null});
    }else{
      this.setState({activeSong: AllSongStore.getCurrentSong()});
    }
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Favorites</div>
          {
            this.state.favSongs.length ?
            <div className="mylist">
              <SongList data = {this.state.favSongs}  page='fav' activeSong = {this.state.activeSong} />
            </div>:
            <div>
              Press <Glyphicon glyph='star' /> on any song to come back to it later
            </div>
          }

      </div>
    );
  }
}

export default AuthenticatedComponent(class User extends React.Component {
  constructor(props) {
    super(props);
    this.gotoMusic = this.gotoMusic.bind(this);
    this.gotoBranches = this.gotoBranches.bind(this);
    this.gotoFavorites = this.gotoFavorites.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.gotoCreate = this.gotoCreate.bind(this);
    this.setsong = this.setsong.bind(this);
    this._changeImgUrl = this._changeImgUrl.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
    this._changedUserData = this._changedUserData.bind(this);
    this.playsong = this.playsong.bind(this);
    this.state = {
      activeSong: null,
      login:false,
      username:'',
      userimg:"",
      userId:-1,
      pageType: 'music',
      currentsong: {},
      forkSong:{}
    }
   }

  componentWillMount(){
    this.setState({userId:UserProfileStore.getCookieID()})
    this.setState({username:UserProfileStore.getCookieName()})
    this.setState({userimg:UserProfileStore.getCookieImg()})

   }

  componentDidMount(){
    ForkedCreateStore.addChangeListener(this._onChange);
    UserImgStore.addChangeListener(this._changeImgUrl);
    UserProfileStore.addChangeListener(this._changedUserData);
    PlaySongStore.addChangeListener(this.playsong);
    this.setState({username:UserProfileStore.getCookieName()});
    // this.setState({userimg:UserProfileStore.getLoggedInUser().userimg})
   }

  componentWillUnmount() {
    ForkedCreateStore.removeChangeListener(this._onChange);
    UserImgStore.removeChangeListener(this._changeImgUrl);
    UserProfileStore.removeChangeListener(this._changedUserData);
    PlaySongStore.removeChangeListener(this.playsong);
  }

  _changedUserData() {
    this.setState({userimg:UserProfileStore.getCookieImg(), username: UserProfileStore.getCookieName()})
  }

  _changeImgUrl(){
    this.setState({userimg:UserImgStore.getImgUrl()},()=>{
      console.log(this.state.userimg)
    });

  }

   _onChange() {
      this.setState({
        forkSong: ForkedCreateStore.getForkCreate()
      },() => {
        this.setState({
          pageType:'create'
        })
      });
  }

  playsong(){
    this.setState({currentsong:PlaySongStore.getSong()});
  }

   gotoMusic(){this.setState({pageType:'music',currentsong:{}});}
   gotoBranches(){this.setState({pageType:'branch',currentsong:{}});}
   gotoFavorites(){ this.setState({pageType:'fav',currentsong:{}}); }
   gotoProfile(){ this.setState({pageType:'profile',currentsong:{}}); }
   gotoCreate(){ this.setState({pageType:'create',currentsong:{}}); }
   setsong(song){ this.setState({currentsong:song}); }

  render() {
    var profilePage;
    if(this.state.pageType==='music'){
      profilePage = <MyMusic switchsong = {this.setsong} userId={this.state.userId}/>
    }else if(this.state.pageType==='branch'){
      profilePage = <ForkList switchsong = {this.setsong} userId={this.state.userId}/>
    }else if(this.state.pageType==='fav'){
      profilePage = <Favor switchsong = {this.setsong} userId={this.state.userId}/>
    }else if(this.state.pageType==='profile'){
      profilePage = <Edit username = {this.state.username} profileImg= {this.state.userimg} userId={this.state.userId}/>
    }else if(this.state.pageType==='create'){
      profilePage = <Create forksong = {this.state.forkSong}/>
    }

    return (
      <div className="profilePage">
        <img className='randomBG' src="../assets/random-bg/down.jpg"></img>
        <div className='profileItem'>
          <img className='profileImg' src = {this.state.userimg}></img>
          <div className='profileUsername'>Hello {this.state.username}</div>
        </div>
        <div className="profileButtonCollection">
          <button className="profileButton" onClick={this.gotoMusic}><Glyphicon glyph='music'  /> MyMusic</button>
          <button className="profileButton" onClick={this.gotoBranches}><Glyphicon glyph='paperclip' onClick={this.gotoBranches} /> Branches</button>
          <button className="profileButton" onClick={this.gotoFavorites}><Glyphicon glyph='heart' /> Favorites</button>
          <button className="profileButton" onClick={this.gotoProfile}><Glyphicon glyph='user' /> Profile</button>
          <button className="profileButton" onClick={this.gotoCreate}><Glyphicon glyph='upload' /> Create</button>
        </div>
        {profilePage}
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} mode = "home" />
        </div>
      </div>
    )
  }

  // User.defaultProps = { profileImg: "../assets/placeholder.jpg" , pageType: "music"};
})

