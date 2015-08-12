var React = require('react/addons');

import {Label} from 'react-bootstrap';

module.exports = React.createClass({
	render: function() {
    if(this.props.mode==='user'){
      return (
        <span className="userSongTitle">{this.props.title} </span>
      );
    }else{
      return (
        <span className="audio-name-label pull-left">{this.props.title} </span>
      );
    }
	}
})