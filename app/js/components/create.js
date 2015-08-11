'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';

class Create extends React.Component {
  constructor() {
    super();
    this.state = {showUpdate: false};

    //bindings
    this.componentDidMount = this.componentDidMount.bind(this);
    this.uploadSong = this.uploadSong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    UserSongStore.addChangeListener(this._onChange); 
  }

  uploadSong() {
    // pull user info from userProfile Store for author
    // title, genre, author, path
    let songData = {
      author: 42,
      path: '1/2/3'
    };
    songData.title = this.refs.songName.getDOMNode().value;
    songData.genre = this.refs.songGenre.getDOMNode().value;
    // songData.author = UserProfileStore.getCurrentUser();
    console.log(songData);
    SongActions.addSong(songData);
  }

  render() {
    return (
      <div className="CreateForm">
      <h1>Create</h1>
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
