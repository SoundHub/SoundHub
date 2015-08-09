'use strict';
import React from 'react';
import MusicPlayer from './musicplayer';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';

var getStateFromStores = function() {
  return {
    songs: AllSongStore.getAllSongs()
  }
}

class Home extends React.Component {

  constructor() {
    super();
    SongActions.getAllSongs();

    // bind all methods to this
    this.render = this.render.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this._onChange = this._onChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    
    this.state = {
      songs: {
        allSongs: []
      }
    }
  }

  componentDidMount () {
    console.log('mounted') 
    AllSongStore.addChangeListener(this._onChange);
  }

  switchSong(song){
    console.log(song);
  }

  render() {
    // console.log("state.songs ",JSON.stringify(this.state));
    // console.log('state in render: ',this.state.songs.allSongs);
    console.log('in render', JSON.stringify(this.state));
    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {this.state.songs.allSongs} />
        <MusicPlayer />
      </div>
    );
  }

  _onChange() {
    console.log('changes');
    this.setState(getStateFromStores());
  }
}

export default Home;

class SongList extends React.Component{
  render(){
    console.log("from render ", JSON.stringify(this.props.data));
    var Songs = this.props.data.map(function(song){
      return(
        <Song songName={song.genre} />
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




