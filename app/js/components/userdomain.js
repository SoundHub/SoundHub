'use strict';
import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import SongList from './songlist';
import Edit from './editprofile';
import Create from './create';
import Router from 'react-router';
import AudioPlayer from './player-components/AudioPlayer';
import UserActionModal from './userActionModal';
import CopyLinkModal from './copyModal';

import SongActions from '../actions/songActionCreators';
import UserActions from '../actions/userActionCreators';

import CreateSuccessModal from './createSuccessModal';
import FavSongStore from '../stores/favSongStore';
import AllSongStore from '../stores/allSongStore';
import UserSongStore from '../stores/userSongStore';
import UserImgStore from '../stores/userImgStore';
import UserProfileStore from '../stores/userProfileStore';
import ForkedSongStore from '../stores/forkedSongStore';
import ModalStore from '../stores/modalStore';
import ForkedCreateStore from '../stores/forkedCreateStore';
import PlaySongStore from '../stores/playSongStore';
import AuthenticatedComponent from './authenticatedComponent';

class ForkList extends React.Component {
  componentDidMount(){
    SongActions.getAllForks(this.props.userId);
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Branches</div>
          {
            this.props.forkedSongs.length ?
            <div className="mylist">
              <SongList data = {this.props.forkedSongs} page='fork' activeSong = {this.props.activeSong} />
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
  componentDidMount(){
    SongActions.getUserCreatedSongs(this.props.userId);
  }
  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">MyMusic</div>
          { this.props.userSongs.length ?
            <div className="mylist">
              <SongList data = {this.props.userSongs} page='mymusic' activeSong = {this.props.activeSong} />
            </div>:
            <div>
              Upload a new song from '<Glyphicon glyph='upload' /> Create' page
            </div>
          }

      </div>
    );
  }
}



class Favor extends React.Component {
  componentDidMount(){
    SongActions.getAllFavs(this.props.userId);
  }
  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Favorites</div>
          {
            this.props.favSongs.length ?
            <div className="mylist">
              <SongList data = {this.props.favSongs}  page='fav' activeSong = {this.props.activeSong} />
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
    this._onUpdate = this._onUpdate.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onShare = this._onShare.bind(this);
    this._onUserStoreChange = this._onUserStoreChange.bind(this);
    this._onForkStoreChange = this._onForkStoreChange.bind(this);
    this._onFavStoreChange = this._onFavStoreChange.bind(this);
    this._changedUserData = this._changedUserData.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onAction = this._onAction.bind(this);
    this.openModal = this.openLinkModal.bind(this);
    this.closeLinkModal = this.closeLinkModal.bind(this);
    this.closeActionModal = this.closeActionModal.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this.playsong = this.playsong.bind(this);
    this.state = {
      votes: [],
      activeSong: null,
      login:false,
      username:'',
      showLinkModal: false,
      userimg:"",
      userId:-1,
      pageType: 'music',
      currentsong: {},
      forkSong:{},
      favSongs: [],  //moving state up to parent
      userSongs: [], //''
      forkedSongs: [] //''
    }
   }

  componentWillMount(){
    this.setState({userId:UserProfileStore.getCookieID()})
    this.setState({username:UserProfileStore.getCookieName()})
    this.setState({userimg:UserProfileStore.getCookieImg()})
    console.log('fuuuuck');
   }

  componentDidMount(){
    console.log(this.state.userId);
    this.setState({forkedSongs: ForkedSongStore.getForkedSongs()});
    this.setState({favSongs: FavSongStore.getAllSongs()});
    this.setState({userSongs: UserSongStore.getUserCreatedSongs().allCreated});
    ForkedCreateStore.addChangeListener(this._onChange);
    UserImgStore.addChangeListener(this._changeImgUrl);
    UserProfileStore.addChangeListener(this._changedUserData);
    this.setState({username:UserProfileStore.getCookieName()})
    ModalStore.addActionListener(this._onAction);
    ModalStore.addCreateListener(this._onCreate);
    PlaySongStore.addChangeListener(this.playsong);
    ForkedSongStore.addChangeListener(this._onForkStoreChange);
    FavSongStore.addChangeListener(this._onFavStoreChange);
    UserSongStore.addChangeListener(this._onUserStoreChange);
    ModalStore.addShareListener(this._onShare);
    AllSongStore.addUpdateListener(this._onUpdate);
   }

  componentWillUnmount() {
    ForkedCreateStore.removeChangeListener(this._onChange);
    UserImgStore.removeChangeListener(this._changeImgUrl);
    UserProfileStore.removeChangeListener(this._changedUserData);
    ModalStore.removeActionListener(this._onAction);
    ModalStore.removeCreateListener(this._onCreate);
    PlaySongStore.removeChangeListener(this.playsong);
    ForkedSongStore.removeChangeListener(this._onForkStoreChange);
    FavSongStore.removeChangeListener(this._onFavStoreChange);
    UserSongStore.removeChangeListener(this._onUserStoreChange);
    ModalStore.removeShareListener(this._onShare);
    AllSongStore.removeUpdateListener(this._onUpdate);
  }

  _changedUserData() {
    this.setState({userimg:UserProfileStore.getCookieImg(), username: UserProfileStore.getCookieName()})
  }

  _changeImgUrl(){
    this.setState({userimg:UserImgStore.getImgUrl()},()=>{
      console.log(this.state.userimg)
    });

  }

  _onAction() {
    this.setState({actionModalVisible: true, actionMessage: ModalStore.getActionMessage()})
    setTimeout(() => {
      this.closeActionModal();
    }, 500)
  }

  _onUpdate() {
    if(this.state.activeSong === AllSongStore.getCurrentSong()){
      console.log('IT WAAS THE SAAAAAME (active song in userdomain update check');
      this.setState({activeSong: null});
    }else{
      console.log('IT WAAS NEWWWWWWW (active song in userdomain update check');
      this.setState({activeSong: AllSongStore.getCurrentSong()});
    }
  }

  _onUserStoreChange() {
    this.setState({userSongs: UserSongStore.getUserCreatedSongs().allCreated});
  }

  _onFavStoreChange() {
    this.setState({favSongs: FavSongStore.getAllSongs()});
  }

  _onForkStoreChange() {
    this.setState({forkedSongs: ForkedSongStore.getForkedSongs()});
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

  _onCreate() {
    this.setState({actionModalVisible: true, actionMessage: ModalStore.getSongCreated() + ' created!'})
    setTimeout(() => {
      this.closeActionModal();
    }, 800)
  }

  closeActionModal() {
    this.setState({actionModalVisible: false});
  }

  _onShare() {
    this.setState({shareMessage: ModalStore.getActionMessage()});
    this.openLinkModal();
  }

  openLinkModal() {
    this.setState({showLinkModal: true});
  }

  closeLinkModal(){
    this.setState({ showLinkModal: false });
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
      profilePage = <MyMusic switchsong = {this.setsong} userId={this.state.userId} userSongs={this.state.userSongs} activeSong={this.state.activeSong} />
    }else if(this.state.pageType==='branch'){
      profilePage = <ForkList switchsong = {this.setsong} userId={this.state.userId} forkedSongs={this.state.forkedSongs} activeSong={this.state.activeSong} />
    }else if(this.state.pageType==='fav'){
      profilePage = <Favor switchsong = {this.setsong} userId={this.state.userId}  favSongs={this.state.favSongs} activeSong={this.state.activeSong} />
    }else if(this.state.pageType==='profile'){
      profilePage = <Edit username = {this.state.username} profileImg= {this.state.userimg} userId={this.state.userId} />
    }else if(this.state.pageType==='create'){
      profilePage = <Create forksong = {this.state.forkSong} />
    }

    return (
      <div className="profilePage">
        <img className='randomBG' src="../assets/random-bg/down.jpg"></img>
        <div className='profileItem'>
          <img className='profileImg' src={this.state.userimg}></img>
          <div className='profileUsername'>Hello {this.state.username}</div>
        </div>
        <UserActionModal show={this.state.actionModalVisible} message={this.state.actionMessage} onHide={this.closeActionModal}/>
        <CopyLinkModal show={this.state.showLinkModal} message={this.state.shareMessage} onHide={this.closeLinkModal}/>
        <div className="profileButtonCollection">
          <button className="profileButton" onClick={this.gotoMusic}><Glyphicon glyph='music'  /> MyMusic</button>
          <button className="profileButton" onClick={this.gotoBranches}><Glyphicon glyph='leaf' onClick={this.gotoBranches} /> Branches</button>
          <button className="profileButton" onClick={this.gotoFavorites}><Glyphicon glyph='star' /> Favorites</button>
          <button className="profileButton" onClick={this.gotoProfile}><Glyphicon glyph='user' /> Profile</button>
          <button className="profileButton" onClick={this.gotoCreate}><Glyphicon glyph='upload' /> Create</button>
        </div>
        {profilePage}
        <div className= "playerBox">
          <AudioPlayer song={this.state.currentsong} mode="home"/>
        </div>
      </div>
    )
  }

})

