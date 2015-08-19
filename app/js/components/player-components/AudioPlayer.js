import React from 'react';
import ButtonPanel from './ButtonPanel';
import ProgressBar from './ProgressBar';
import VolumeBar from './VolumeBar';
import TimeLabel from './TimeLabel';
import NameLabel from './NameLabel';
import {Button,Glyphicon} from 'react-bootstrap';
import SongActions from '../../actions/songActionCreators';
import UserProfileStore from '../../stores/userProfileStore';
import VotedSongStore from '../../stores/votedSongStore';
import AllSongStore from '../../stores/allSongStore';

var Howl = require('./howler').Howl;

module.exports = React.createClass({

	getInitialState:function() {
		return {
			isPlaying: false,
			isPause: false,
			isLoading: false,
			volume: 0.5,
			song:null
		};
	},

	componentWillUnmount:function(){
		this.clearSoundObject();
		this.playEnd();
	},

	componentWillReceiveProps: function(nextProps,nextState){
		if(nextProps.song!==this.props.song){
			this.clearSoundObject();
			this.setState({song:nextProps.song}, () => {
				this.playEnd();
				this.clearSoundObject();
				if(nextProps.song.url){
					this.play();
				}
			})
		}
	},

	render: function() {
		var percent = 0;
		var songName;
		if (this.state.seek && this.state.duration) {
			percent = this.state.seek / this.state.duration;
		}
		var topComponents = [
			<ButtonPanel
			 isPlaying={this.state.isPlaying}
			 isPause={this.state.isPause}
			 isLoading={this.state.isLoading}
			 onPlayBtnClick={this.onPlayBtnClick}
			 onPauseBtnClick={this.onPauseBtnClick}/>,
			<ProgressBar percent={percent} seekTo={this.seekTo} />,
			<VolumeBar volume={this.state.volume} adjustVolumeTo={this.adjustVolumeTo} />,
			<Button bsSize="small" className="audio-rbtn" onClick={this.props.fav}><Glyphicon glyph='heart' /></Button>,
			<Button bsSize="small" className="audio-rbtn" onClick={this.props.handleUpvote}><Glyphicon glyph='chevron-up' /></Button>,
			<Button bsSize="small" className="audio-rbtn" onClick={this.props.handleDownvote}><Glyphicon glyph='chevron-down' /></Button>,
			<Button bsSize="small" className="audio-rbtn" onClick={this.props.forkSong}><Glyphicon glyph='paperclip' /></Button>
		];
		if(this.state.song) {
			songName = this.state.song.title;
		} else {
			songName = 'Please add a song'
		}

		var userPageComponents = [
			<ButtonPanel mode='user'
			 isPlaying={this.state.isPlaying}
			 isPause={this.state.isPause}
			 isLoading={this.state.isLoading}
			 onPlayBtnClick={this.onPlayBtnClick}
			 onPauseBtnClick={this.onPauseBtnClick}/>,
		  <NameLabel mode='user' title={songName} />
	  ];

	  if(this.props.mode==='user'){
	  	return (
	  		<div>{ userPageComponents }</div>
	  		);
	  } else {
	  	return (
				<div className="audio-player">
					<div className="clearfix">
						{ topComponents }
					</div>
					<div className="audio-desc-container clearfix">
						<NameLabel title={songName} />
						<TimeLabel seek={this.state.seek} duration={this.state.duration}/>
					</div>
				</div>
			);
	  }
	},


	onPlayBtnClick: function() {
		if (this.state.isPlaying && !this.state.isPause) {
			return;
		};
		this.play();
	},

	onPauseBtnClick: function() {
		var isPause = !this.state.isPause;
		this.setState({ isPause: isPause });
		isPause ? this.pause() : this._play();
	},

	play: function() {
		if(this.state.song){
			this.setState({ isPlaying: true, isPause: false });
			if (!this.howler) {
				this.initSoundObject();
			} else {
				var songUrl = this.state.song.url;
				if (songUrl != this.howler._src) {
					this.initSoundObject();
				} else {
					this._play();
				}
			}
		}
	},

	initSoundObject: function() {
		this.clearSoundObject();
		this.setState({isLoading: true});
		var song = this.state.song;
		this.howler = new Howl({
			src: song.url,
			volume: this.state.volume,
			onload: this.initSoundObjectCompleted,
			onend: this.playEnd
		});
	},

	clearSoundObject: function() {
 		if (this.howler) {
			this.howler.stop();
			this.howler = null;
		}
 	},

	initSoundObjectCompleted: function() {
		this._play();
		this.setState({
			duration: this.howler.duration(),
			isLoading: false
		});
	},

	_play: function() {
		this.howler.play();
		this.stopUpdateCurrentDuration();
		this.updateCurrentDuration();
		this.interval = setInterval(this.updateCurrentDuration, 1000);
	},

	playEnd: function() {
		this.stop();
	},

	stop: function() {
		this.stopUpdateCurrentDuration();
		this.setState({ seek: 0, isPlaying: false });
	},

	pause: function() {
		this.howler.pause();
		this.stopUpdateCurrentDuration();
	},

	updateCurrentDuration: function() {
		this.setState({ seek: this.howler.seek() });
	},

	stopUpdateCurrentDuration: function() {
		clearInterval(this.interval);
	},

	seekTo: function(percent) {
		var seek = this.state.duration * percent;
		this.howler.seek(seek);
		this.setState({ seek: seek });
	},

	adjustVolumeTo: function(percent) {
		this.setState({ volume: percent });
		if (this.howler) {
			this.howler.volume(percent);
		}
	}

});
