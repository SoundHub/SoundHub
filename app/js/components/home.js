'use strict';
import React from 'react';
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
    this.switchSong = this.switchSong.bind(this);
    this.state = {currentsong: props.currentsong}
   }

  switchSong(song){
    this.setState({currentsong:song});
  }

  render() {
    return (
      <div>
        <h1>This is Home</h1>
        <SongList data = {arr}  switchSong = {this.switchSong} />
        <AudioPlayer song = {this.state.currentsong} />
      </div>
    );
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

