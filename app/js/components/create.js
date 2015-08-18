'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';
import UserProfileStore from '../stores/userProfileStore'
import ReactS3Uploader from 'react-s3-uploader';

// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:d23a3717-f2ef-47c3-ac35-3ee1238e6c8f',
// });

// possibly not necessary
// AWS.config.credentials.get(function() {
//   const client = new AWS.CognitoSyncManager();
//   console.log('aws config: ', client)
//   client.openOrCreateDataset('soundhub', function(err, dataset) {
//     console.log('dataset: ', dataset)
//     dataset.put('newRecord', 'newValue', function(err, record) {
//       console.log(record);
//     });
//   });
// });


class Create extends React.Component {
  constructor() {
    super();
    this.state = {showUpdate: false};

    //bindings
    this.componentDidMount = this.componentDidMount.bind(this);
    this.uploadSong = this.uploadSong.bind(this);
    this.render = this.render.bind(this);
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
    let letters = /^[A-Za-z\s]+$/;
    let songData = {};

    songData.title = this.refs.songName.getDOMNode().value;
    songData.genre = this.refs.songGenre.getDOMNode().value;
    songData.rootId = this.props.forksong.rootId;
    songData.parentId = this.props.forksong.uuid;
    songData.url = this.state.file;

    songData.author = UserProfileStore.getCookieID();
    songData.authorName = UserProfileStore.getCookieName();
    songData.authorPic = UserProfileStore.getCookieImg();


    if(!songData.title.match(letters)){
      alert('Song title must have alphabet characters only');
    }else if(songData.title.length < 4 || songData.title.length > 20){
      alert('Song title can only has 4 to 20 characters');
    }else{
      SongActions.addSong(songData);
      this.refs.songName.getDOMNode().value = '';
      this.refs.songGenre.getDOMNode().value = '';
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
                <ReactS3Uploader
                  signingUrl="/s3/sign"
                  accept="audio/*"
                  onProgress={this.onUploadProgress}
                  onError={this.onUploadError}
                  onFinish={this.onUploadFinish}/>
                <input type="text" placeholder="Name" ref="songName"/>
                <input type="text" placeholder="Genre" ref="songGenre" />
                <div>{this.props.forksong.title}</div>
                <input className="btn btn-success" type="button" value="Create" onClick={this.uploadSong}/>
                { this.state.showUpdate ? <div>{this.state.newestCreated.title} added!</div> : null }
            </div>
      </div>
    );
  }

}

export default Create;

