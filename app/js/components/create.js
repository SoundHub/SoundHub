'use strict';
import React from 'react';

class Create extends React.Component {
  render() {
    return (
      <div>
        <h1>UPLOAD YOUR MUSIC</h1>
        <input type="text" placeholder="Title" ref="title" />
        <input type="text" placeholder="Genre" ref="genre" />
        <input type="file" />
        <button>CREATE</button>
      </div>

    );
  }
}

export default Create;
