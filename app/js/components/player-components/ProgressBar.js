import React from 'react';
import classnames from 'classnames';
import {ProgressBar} from 'react-bootstrap';

module.exports = React.createClass({

	getDefaultProps: function() {
		return { progressStyle : { marginLeft: '5px' } };
	},

	render: function() {
		var percent = this.props.percent * 100;
		var style = { width: percent + "%" };
		var classes = classnames({
  		'audio-progress-container': true,
  		'pull-left': true,
  		'audio-progress-container-short-width': this.props.shorter
		});

		return (
			<div ref="progressBar" className={classes} style={this.props.progressStyle} onClick={this.seekTo}>
				<div className="audio-progress" style={style}></div>
			</div>
		);
	},

	seekTo: function(e){
		if (!this.props.percent) {
			return;
		}
		var container = $(this.refs.progressBar.getDOMNode());
		var containerStartX = container.offset().left;
		var percent = (e.clientX - containerStartX) / container.width();
		percent = percent >= 1 ? 1 : percent;
		this.props.seekTo(percent);
	}

})