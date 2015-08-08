'use strict';
import React from 'react';

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
  render() {
    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {arr} />
        <audio>
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}
export default Home;


class Song extends React.Component{
  render(){
    return(
      <div>
        {this.props.songName}
      </div>
    );
  }
}

class SongList extends React.Component{
  render(){
    var Songs = this.props.data.map(function(song){
      return(
        <Song songName = {song.songName} />
      );
    });

    return (
      <div className="songList">
        {Songs}
      </div>
    );

  }
}



