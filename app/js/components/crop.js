'use strict';

var React = require('react'), AvatarEditor = require('react-avatar-editor');
var MyEditor = React.createClass({
  onClickSave: function() {
    var dataURL = this.refs.editor.getImage();
    console.log(dataURL)
    // now save it to the state and set it as <img src="…" /> or send it somewhere else
  },
  render: function() {
    return (
        <AvatarEditor
          image="http://example.com/initialimage.jpg"
          width={250}
          height={250}
          border={50}
          scale={1.2} />
    );
  }

});

module.exports = MyEditor;
