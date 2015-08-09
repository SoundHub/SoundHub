'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';
var AudioPlayer = require("./player-components/AudioPlayer");

var currentsong = {
    name: "bang bang bang",
    url: "assets/bang.mp3"
}

var arr = [{
  name:'badboy',
  url: "assets/badboy.mp3"
},{
  name:'bang bang bang',
  url: "assets/bang.mp3"
}];


class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    this.render = this.render.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this._onChange = this._onChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {songs: {
        allSongs: [],
        currentsong:props.currentsong
      }
    }
  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
  }

  switchSong(song){
    this.setState({currentsong:song});
  }

  render() {
    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {this.state.songs.allSongs}  switchSong = {this.switchSong} />
        <AudioPlayer song = {this.state.currentsong} />
      </div>
    );
  }

  _onChange() {
    console.log('changes');
    this.setState({songs: AllSongStore.getAllSongs()});
  }
}


Home.defaultProps = { currentsong :   {
    name: "song1",
    url: "assets/badboy.mp3"
  }
}

class SongList extends React.Component{
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
   }

  handleClick(i){
    this.props.switchSong(this.props.data[i]);
  }

  render() {
    return (
      <div>
        {this.props.data.map(function(song, i) {
          return (
            <div onClick={this.handleClick.bind(this, i)} key={i}> {song.name} </div>
          );
        }, this)}
      </div>
    );
  }
}



export default Home;

