'use strict';
import React from 'react';
import Router from 'react-router';
import SongActions from '../actions/songActionCreators';
import AllSongStore from '../stores/allSongStore';
import {Glyphicon} from 'react-bootstrap';
import AudioPlayer from './player-components/AudioPlayer';
import UserProfileStore from '../stores/userProfileStore';

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

  componentWillUnmount() {
    AllSongStore.removeChangeListener(this._onChange);
  }

  switchSong(song){
    this.setState({currentsong:song});
  }

  _onChange() {
    this.setState({songs: AllSongStore.getAllSongs()});
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

                <Router.Link to="tree"  params={song}>
                  <span className = "title"  > {i} {song.title} </span>
                </Router.Link>
                <span className> by {song.author} </span>
                <span className="like-count" > <Glyphicon glyph='heart' /> {song.like} </span>

                {
                  this.props.uploadmode ?
                  <div className="itemOther" onClick={this.forkclick.bind(this,i)}>
                    <Glyphicon glyph='tags' />
                  </div>: null
                }

                { this.props.uploadmode ?
                  <a href={song.url} download>
                    <div className="itemOther" >
                      <Glyphicon glyph='download' />
                    </div>
                  </a> : null
                }
              </div>
          );
        }, this)}
      </div>
    );
  }
}


export { SongList, Home };
export default Home;

