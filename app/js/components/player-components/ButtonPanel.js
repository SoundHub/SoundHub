import React from 'react';
import {Button,Glyphicon,ButtonGroup} from 'react-bootstrap';

module.exports = React.createClass({
	render: function() {

		var isPlaying = this.props.isPlaying;
		var isPause = this.props.isPause;
		var isLoading = this.props.isLoading;
		var isShowPlayBtn = !isPlaying || isPause;
		var buttonClickHandler = isShowPlayBtn ? this.props.onPlayBtnClick : this.props.onPauseBtnClick;
		var iconName;
		var iconClasses = "";

		if (isLoading) {
			iconName = "refresh";
			iconClasses = "audio-refresh-animate";
		} else {
			iconName = isShowPlayBtn ? "play" : "pause";
		}

		var buttonPanelClasses = "audio-button-panel pull-left";
		if(this.props.mode==='user'){
			return(
					<Button className="userPlayButton" onClick={buttonClickHandler}>
						<Glyphicon className={iconClasses} glyph={iconName} />
					</Button>
			);
		}else{
			return (
				<ButtonGroup className={buttonPanelClasses}>
					<Button bsSize="small" class onClick={buttonClickHandler}>
						<Glyphicon className={iconClasses} glyph={iconName} />
					</Button>
				</ButtonGroup>
			);
		}

	}
});