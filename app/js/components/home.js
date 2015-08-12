'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';
import {Glyphicon} from 'react-bootstrap';
var AudioPlayer = require("./player-components/AudioPlayer");

var arr = [{
  title:'badboy',
  url: "assets/badboy.mp3"
},{
  title:'bang bang bang',
  url: "assets/bang.mp3"
},{
  title:'tonight',
  url: "assets/giveyouup.mp3"
}];



class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    //should this be this.setState instead?

    this.state = {songs: {
        allSongs: [],
      }
    }

    //bindings
    this.componentDidMount = this.componentDidMount.bind(this);
    this.switchSong = this.switchSong.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);

  }

  componentDidMount () {
    AllSongStore.addChangeListener(this._onChange);
  }

  switchSong(song){
    this.setState({currentsong:song});
  }

  render() {
    return (
      <div className= "HomePage">
        <div className= "playerBox">
          <AudioPlayer song = {this.state.currentsong} />
        </div>
        <SongList data = {arr}  switchSong = {this.switchSong} />
      </div>
    );
  }
  // this.state.songs.allSongs

  _onChange() {
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
            <div className = "songItem" key={i}>
              <span className = "title" onClick={this.handleClick.bind(this, i)} > {song.title} </span>
              <span className> by {song.author} </span>
              <span className="like-count" > <Glyphicon glyph='heart' /> {song.like} </span>
            </div>
          );
        }, this)}
      </div>
    );
  }
}



export default Home;

