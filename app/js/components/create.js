'use strict';
import React from 'react';
import Dropzone from 'react-dropzone';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';
import UserProfileStore from '../stores/userProfileStore'
import ReactS3Uploader from 'react-s3-uploader';

// Initialize the Amazon Cognito credentials provider
// AWS.config.update({accessKeyId: 'AKIAJBIPG6KKCLNJN3NQ', secretAccessKey: '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'});
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:d23a3717-f2ef-47c3-ac35-3ee1238e6c8f',
});

// possibly not necessary
AWS.config.credentials.get(function() {
  const client = new AWS.CognitoSyncManager();
  console.log('aws config: ', client)
  client.openOrCreateDataset('soundhub', function(err, dataset) {
    console.log('dataset: ', dataset)
    dataset.put('newRecord', 'newValue', function(err, record) {
      console.log(record);
    });
  });
});


let songData = {
  author: 42,
  path: '1/2/3'
};

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

  uploadSong() {
    // pull user info from userProfile Store for author
    // title, genre, author, path
    songData.title = this.refs.songName.getDOMNode().value;
    songData.genre = this.refs.songGenre.getDOMNode().value;
    songData.url = this.state.file;
    songData.author = UserProfileStore.getLoggedInUser().userId;
    SongActions.addSong(songData);

    // clear input fields after submit
    this.refs.songName.getDOMNode().value = '';
    this.refs.songGenre.getDOMNode().value = '';
  }

  onUploadFinish(result) {
    this.setState({file: result.publicUrl})
  }

  render() {
    return (
      <div className="CreateForm">
      <h1>Create your sound here!</h1>
      <h3>Upload file:</h3>
      <ReactS3Uploader
          signingUrl="/s3/sign"
          accept="audio/*"
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}/>
        <input type="text" placeholder="Name" ref="songName"/>
        <input type="text" placeholder="Genre" ref="songGenre" />
        <input type="button" value="Create" onClick={this.uploadSong}/>
        { this.state.showUpdate ? <div>{this.state.newestSong.title} added!</div> : null }
      </div>
    );
  }

  _onChange() {
    this.setState({
      newestSong: UserSongStore.getUserSongs().newestSong, 
      showUpdate: true
    })
  }
}

export default Create;

