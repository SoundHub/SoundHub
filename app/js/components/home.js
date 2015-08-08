'use strict';
import React from 'react';
import MusicPlayer from './musicplayer';
import SongActions from '../actions/songActionCreators';

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

class Home extends React.Component {
  
  constructor() {
    super();
    this.switchSong = this.switchSong.bind(this);
    this.state = SongActions.getAllSongs();
   }

  switchSong(song){
    console.log(song);
  }

  render() {
    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {arr} />
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




