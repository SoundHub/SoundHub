'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import UserSongStore from '../stores/userSongStore';

class Create extends React.Component {
  constructor() {
    super();
    this.uploadSong = this.uploadSong.bind(this);
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
      </div>
      // <div>
      //   <h1>UPLOAD YOUR MUSIC</h1>
      //   <input type="text" placeholder="Title" ref="title" />
      //   <input type="text" placeholder="Genre" ref="genre" />
      //   <input type="file" />
      //   <button>CREATE</button>
      // </div>
    );
  }

  _onChange() {
    this.setState({newestSong: UserSongStore.getNewestSong})
  }
}

export default Create;
