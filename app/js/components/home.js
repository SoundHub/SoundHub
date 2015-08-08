'use strict';
import React from 'react';
import MusicPlayer from './musicplayer';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';


var arr = [
{
  songName:'song1'
},{
  songName:'song2'
},{
  songName:'song3'
},{
  songName:'song4'
}];

var getStateFromStores = function() {
  return {
    songs: AllSongStore.getAllSongs()
  }
}

class Home extends React.Component {

  constructor() {
    super();
    SongActions.getAllSongs();
    // NOTE: cannot use setstate in constructor
    this.state = {
      songs: AllSongStore.getAllSongs()
    }
    this.switchSong = this.switchSong.bind(this);
    // this.state = {songs: arr};
    console.log(this.state);
  }

  componentDidMount () {
    this.setState(AllSongStore.getAllSongs());
    AllSongStore.addChangeListener(this._onChange);
    console.log(this.state);
  }

  switchSong(song){
    console.log(song);
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

  render() {
    console.log("state.songs ",JSON.stringify(this.state));
    console.log('state in render: ',this.state.songs.allSongs);

    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {this.state} />
        <MusicPlayer />
      </div>
    );
  }
}

export default Home;

class SongList extends React.Component{
  render(){
    var Songs = this.props.data.map(function(song){
      return(
        <Song songName={song.songName} />
      );
    });

    return (
      <div className="songList" >
        {Songs}
      </div>
    );

  }
}


class Song extends React.Component{
  constructor() {
    super();
    this.play = this.play.bind(this);
   }

  play(){
    console.log(this.props.songName)
  }

  render(){
    return(
      <div onClick={this.play}>
        {this.props.songName}
      </div>
    );
  }
}




