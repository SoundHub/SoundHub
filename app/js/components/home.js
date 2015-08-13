'use strict';
import React from 'react';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';
import {Glyphicon} from 'react-bootstrap';

var AudioPlayer = require("./player-components/AudioPlayer");

var arr = [{
  title:'badboy',
  url: "assets/badboy.mp3",
  author:"big bang",
  like:"223",
  img:"assets/album/1.png",
  id: 1
},{
  title:'bang bang bang',
  url: "assets/bang.mp3",
  author:"big bang",
  like:"53",
  img:"assets/album/2.jpg",
  id: 2
},{
  title:'tonight',
  url: "assets/giveyouup.mp3",
  author:"big bang",
  like:"103",
  img:"assets/album/3.jpg",
  id: 3
}];


class Home extends React.Component {
  constructor(props) {
    super(props);
    SongActions.getAllSongs();
    this.state = {songs: {allSongs: []}}
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
        <AudioPlayer song = {this.state.currentsong} mode = "home" />
      </div>
        <SongList data = {this.state.songs.allSongs} switchSong = {this.switchSong} />
      </div>
    );
  }
  // this.state.songs.allSongs

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
    console.log(this.state);
  }
}

class SongList extends React.Component{
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.forkclick = this.forkclick.bind(this);
   }

  handleClick(i){
    this.props.switchSong(this.props.data[i]);
  }

  forkclick(i){
    let forkSong = this.props.data[i]
    SongActions.createFromFork(forkSong);
    //action pass data to create comp and pass state to user panel(pageType==='create')

  }

  render() {
    return (
      <div className="playList" >
        {this.props.data.map(function(song, i) {
          return (
            <div className = "songItem effect8" key={i}>
              <div className="itemPlay" onClick={this.handleClick.bind(this, i)}>
                <Glyphicon glyph='play' />
              </div>
              <span className = "title"  > {i} {song.title} </span>
              <span className> by {song.author} </span>
              <span className="like-count" > <Glyphicon glyph='heart' /> {song.like} </span>

              { this.props.uploadmode ? <button onClick={this.forkclick.bind(this,i)}> + </button>: null }
            </div>
          );
        }, this)}
      </div>
    );
  }
}


export { SongList, Home };
export default Home;

