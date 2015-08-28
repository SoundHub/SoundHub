'use strict';
import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';
import UserProfileStore from '../stores/userProfileStore'
import ReactS3Uploader from 'react-s3-uploader';
import RouterActions from '../actions/routerActionCreators';
import ModalStore from '../stores/modalStore';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {showUpdate: false, uploadDone: false, songTitle: ''};
    //bindings
    this.componentDidMount = this.componentDidMount.bind(this);
    this.uploadSong = this.uploadSong.bind(this);
    this.render = this.render.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onUploadFinish = this.onUploadFinish.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onCreate = this._onCreate.bind(this);
    this._onSongTitleEntry = this._onSongTitleEntry.bind(this);
  }

  componentDidMount() {
    UserSongStore.addChangeListener(this._onChange);
    ModalStore.addCreateListener(this._onCreate);
  }

  componentWillUnmount() {
    UserSongStore.removeChangeListener(this._onChange);
    ModalStore.removeCreateListener(this._onCreate);
    this.props.forksong.title = null;
  }

  _onChange() {
    this.setState({
      newestCreated: UserSongStore.getUserCreatedSongs().newestCreated
    })
  }

  _onCreate() {
    this.setState({
      uploadProgress: 0, 
      uploadStatus: null,
      uploadDone: false})
  }

  _onSongTitleEntry(event, value) {
    this.setState({songTitle: event.target.value})
  }

  uploadSong() {
    let letters = /^[A-Za-z0-9 ]+$/;
    let songData = {};
    songData.title = this.state.songTitle;
    songData.rootId = this.props.forksong.rootId;
    songData.parentId = this.props.forksong.uuid;
    songData.url = this.state.file;

    songData.author = UserProfileStore.getCookieID();
    songData.authorName = UserProfileStore.getCookieName();
    songData.authorPic = UserProfileStore.getCookieImg();


    if(!songData.title.match(letters)) {
      alert('Song title must have alphabet characters only');
    } else if(songData.title.length < 3 || songData.title.length > 15){
      alert('Song title can only has 3 to 15 characters');
    } else {
      RouterActions.createSong(songData);
      SongActions.addSong(songData);
      console.log('this.refs.songname', this.refs.songName)
      this.setState({songTitle: ''});
      // this.refs.songName.getDOMNode().value = '';
    }
  }

  onUploadProgress(percent, message) {
    this.setState({ uploadProgress: percent });
    if(percent === 100) {
      this.setState({ uploadDone: true })
    } else {
      this.setState({ uploadStatus: 'Uploading: ' + percent + '% done' })
    }
  }

  onUploadFinish(result) {
    this.setState({file: result.publicUrl})
  }

  render() {
    return (
        <div className="boxed-group-profile CreateForm">
            <div className="pageTitle">Create</div>
            <div className="edit-profile-avatar">
            <div>
              { this.state.uploadDone ? <div>Upload Complete!</div> : <div>{this.state.uploadStatus}</div> }
              <ProgressBar now={this.state.uploadProgress}/> 
            </div>
                <ReactS3Uploader
                  signingUrl="/s3/sign"
                  accept="audio/*"
                  onProgress={this.onUploadProgress}
                  onError={this.onUploadError}
                  onFinish={this.onUploadFinish}/>
                <input className='inputSongName' type="text" placeholder="Song title" value={this.state.songTitle} onChange={this._onSongTitleEntry}/>
                <div>
                <button disabled={!this.state.uploadDone} type="button" className="btn btn-success createButton" 
                onClick={this.uploadSong}> 
                {this.props.forksong.title ? <span>Create branch of {this.props.forksong.title}</span> : <span>Create new tree</span> } 
                </button>
                </div>
            </div>
      </div>
    );
  }

}

export default Create;

