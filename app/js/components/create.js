'use strict';
import React from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';
import UserProfileStore from '../stores/userProfileStore'
import ReactS3Uploader from 'react-s3-uploader';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {showUpdate: false, uploadDone: false};
    //bindings
    this.componentDidMount = this.componentDidMount.bind(this);
    this.uploadSong = this.uploadSong.bind(this);
    this.render = this.render.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onUploadFinish = this.onUploadFinish.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    UserSongStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserSongStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      newestCreated: UserSongStore.getUserCreatedSongs().newestCreated,
      showUpdate: true
    })
  }

  uploadSong() {
    let letters = /^[A-Za-z0-9 ]+$/;
    let songData = {};

    songData.title = this.refs.songName.getDOMNode().value;
    songData.genre = this.refs.songGenre.getDOMNode().value;
    songData.rootId = this.props.forksong.rootId;
    songData.parentId = this.props.forksong.uuid;
    songData.url = this.state.file;

    songData.author = UserProfileStore.getCookieID();
    songData.authorName = UserProfileStore.getCookieName();
    songData.authorPic = UserProfileStore.getCookieImg();


    if(!songData.title.match(letters)) {
      alert('Song title must have alphabet characters only');
    } else if(songData.title.length < 4 || songData.title.length > 20){
      alert('Song title can only has 4 to 20 characters');
    } else {
      SongActions.addSong(songData);
      this.refs.songName.getDOMNode().value = '';
      this.refs.songGenre.getDOMNode().value = '';
    }
  }

  onUploadProgress(percent, message) {
    this.setState({ uploadProgress: percent });
    if(percent === 100) {
      this.setState({ uploadDone: true })
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
            <ProgressBar active now={this.state.uploadProgress}/>
                <ReactS3Uploader
                  signingUrl="/s3/sign"
                  accept="audio/*"
                  onProgress={this.onUploadProgress}
                  onError={this.onUploadError}
                  onFinish={this.onUploadFinish}/>
                <input type="text" placeholder="Name" ref="songName"/>
                <input type="text" placeholder="Genre" ref="songGenre" />
                <div>{this.props.forksong.title}</div>
                <button diasbled={!this.state.uploadDone} type="button" className="btn btn-success" onClick={this.uploadSong}>
                Create </button>
                { this.state.showUpdate ? <div>{this.state.newestCreated.title} added!</div> : null }
            </div>
      </div>
    );
  }

}

export default Create;

