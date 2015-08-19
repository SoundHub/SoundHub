'use strict';
import React from 'react';
import Router from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import SongActions from '../actions/songActionCreators';

class SongList extends React.Component{
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.forkclick = this.forkclick.bind(this);
    this.togglePenel = this.togglePenel.bind(this);
   }

  togglePenel(i){
    let item = 'item'+i
    console.log('select' + i);
    console.log(this.refs[item].props.className)
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
            <div className ="songBox" key={i}>

              <div className = "songItem effect8"  onClick={this.togglePenel.bind(this, i)}>
                <Router.Link to="tree"  params={song}>
                  <span className = "title"  > {i} {song.title} </span>
                </Router.Link>
                <span className> by {song.authorName} </span>
                <span className="like-count" > <Glyphicon glyph='heart' /> {song.like} </span>
              </div>

              <div className="songPanel" ref={'item' + i}>
                  <div className="itemOther" onClick={this.handleClick.bind(this, i)}>
                    <Glyphicon glyph='play' />
                  </div>
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
              </div>
          );
        }, this)}
      </div>
    );
  }
}

export default SongList;
