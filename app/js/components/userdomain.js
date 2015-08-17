'use strict';
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import {SongList} from './home';
import Edit from './editprofile';
import Create from './create';
import Router from 'react-router';
import AudioPlayer from './player-components/AudioPlayer';
import UserSongStore from '../stores/userSongStore';
import UserImgStore from '../stores/userImgStore';
import SongActions from '../actions/songActionCreators';
import UserActions from '../actions/userActionCreators';
import UserProfileStore from '../stores/userProfileStore';
import ForkedSongStore from '../stores/forkedSongStore';
import ForkedCreateStore from '../stores/forkedCreateStore';


var arr = [{
  title:'badboy',
  url: "assets/badboy.mp3",
  author:"big bang",
  like:"223",
  id:'1'
},{
  title:'bang bang bang',
  url: "assets/bang.mp3",
  author:"big bang",
  like:"53",
  id:'2'
},{
  title:'tonight',
  url: "assets/giveyouup.mp3",
  author:"big bang",
  like:"103",
  id:'3'
}];


var user = {
  userId:1,
  username:"Richie",
  profileImg:"../assets/profileImg.jpg"
}

class ForkList extends React.Component {
  constructor() {
    super();
    this.state = {forkedSongs: []};
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ForkedSongStore.addChangeListener(this._onChange);
    SongActions.getAllForks(this.props.userId);
  }

  componentWillUnmount() {
    ForkedSongStore.removeChangeListener(this._onChange);
  }

  switchSong(song){
    this.props.switchsong(song)
  }

  _onChange() {
    console.log('on change')
    this.setState({forkedSongs: ForkedSongStore.getForkedSongs()});
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Branches</div>
          <div className="mylist">
            <SongList data = {this.state.forkedSongs}  switchSong = {this.switchSong} uploadmode={true}/>
          </div>
      </div>
    );
  }

}


class MyMusic extends React.Component {
  constructor() {
    super();
    this.state = {userSongs: []};
    this.switchSong = this.switchSong.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    SongActions.getUserCreatedSongs(this.props.userId);
    UserSongStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserSongStore.removeChangeListener(this._onChange);
  }

  switchSong(song){
    this.props.switchsong(song)
  }

  _onChange() {
    this.setState({userSongs: UserSongStore.getUserCreatedSongs().allCreated});
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">MyMusic</div>
          <div className="mylist">
            <SongList data = {this.state.userSongs}  switchSong = {this.switchSong} />
          </div>
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
    this.gotoCreate = this.gotoCreate.bind(this);
    this.setsong = this.setsong.bind(this);
    this._changeImgUrl = this._changeImgUrl.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this._onChange = this._onChange.bind(this);
    this.state = {
      login:false,
      username:'',
      userimg:"",
      userId:-1,
      pageType: props.pageType,
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

    this.setState({username:UserProfileStore.getCookieName()})
    // this.setState({userimg:UserProfileStore.getLoggedInUser().userimg})
   }

  componentWillUnmount() {
    ForkedCreateStore.removeChangeListener(this._onChange);
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

   gotoMusic(){this.setState({pageType:'music',currentsong:{}});}
   gotoBranches(){this.setState({pageType:'branch',currentsong:{}});}
   gotoFavourites(){ this.setState({pageType:'fav',currentsong:{}}); }
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
      profilePage = <Favor />
    }else if(this.state.pageType==='profile'){
      profilePage = <Edit username = {this.state.username} profileImg= {user.profileImg}/>
    }else if(this.state.pageType==='create'){
      profilePage = <Create forksong = {this.state.forkSong}/>
    }

    return (
      <div className="profilePage">
      <AudioPlayer song = {this.state.currentsong} mode = "user" />
        <img className='randomBG' src="../assets/random-bg/13772829224_76f2c28068_h.jpg"></img>
        <div className='profileItem'>
          <img className='profileImg' src = {this.state.userimg}></img>
          <div className='profileUsername'>{this.state.username}</div>
        </div>
        <div className="profileButtonCollection">
          <button className="profileButton" onClick={this.gotoMusic}><Glyphicon glyph='music'  /> MyMusic</button>
          <button className="profileButton" onClick={this.gotoBranches}><Glyphicon glyph='paperclip' onClick={this.gotoBranches} /> Branches</button>
          <button className="profileButton" onClick={this.gotoFavourites}><Glyphicon glyph='heart' /> Favourites</button>
          <button className="profileButton" onClick={this.gotoProfile}><Glyphicon glyph='user' /> Profile</button>
          <button className="profileButton" onClick={this.gotoCreate}><Glyphicon glyph='upload' /> Create</button>
        </div>
        {profilePage}
      </div>
    )
  }
}
User.defaultProps = { profileImg: "../assets/placeholder.jpg" , pageType: "music"};

export default User;
