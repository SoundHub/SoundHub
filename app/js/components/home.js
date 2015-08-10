'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';
var AudioPlayer = require("./player-components/AudioPlayer");

var arr = [{
  name:'badboy',
  url: "assets/badboy.mp3"
},{
  name:'bang bang bang',
  url: "assets/bang.mp3"
},{
  name:'tonight',
  url: "assets/giveyouup.mp3"
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
        <AudioPlayer song = {this.state.currentsong} />
        <SongList data = {arr}  switchSong = {this.switchSong} />
      </div>
    );
  }

  _onChange() {
    console.log('changes');
    this.setState({songs: AllSongStore.getAllSongs()});
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
      <div className="playList" >
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

