'use strict';

/*
var mockData = [{
  id: 1,
  title: 'Smells like teen spirit',
  like: 2,
  genre: 'Grunge',
  forks: 3,
  author: 1,
  children: [
    {
      id: 2,
      title: 'Innagodidavida',
      like: 4,
      genre: 'Rock',
      forks: 2,
      author: 2,
      children: [
        {
          id: 3,
          title: 'Purple Haze',
          like: 7,
          genre: 'Rock',
          forks: 0,
          author: 3
        },
        {
          id: 666,
          title: 'In League with Satan',
          like: 666,
          genre: 'Metal',
          forks: 0,
          author: 666
        }
      ]
    },
    {
      id: 4,
      title: 'Tonight, Tonight',
      like: 8,
      genre: 'Grunge',
      forks: 0,
      author: 27
    },
    {
      id: 33,
      title: '33 222 1 222',
      genre: 'Jazz',
      like: 222,
      forks: 1,
      author: 222,
      children: [
        {
          id: 42,
          title: 'So long and thanks for all the fish',
          genre: 'Jazz',
          like: 42,
          forks: 0,
          author: 42
        }
      ]
    }
  ]
}];
*/


import React from 'react';
import D3Tree from './tree.js';
import SongActions from '../actions/songActionCreators';
import SongTreeStore from '../stores/songTreeStore';

class Page extends React.Component {
  constructor() {
    super();
    let uuid = window.location.pathname.split('/')[2];
    console.log('constructor uuid: ', uuid);
    SongActions.getSongTree({rootId: uuid});  //'/1/'  '/1/2/'
    this.state = {
      treeData: {}
    }

    SongTreeStore.getTree();

    this.componentWillMount = this.componentWillMount.bind(this);
    // this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    SongTreeStore.addChangeListener(this._onChange);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('tree.js componentWillReceiveProps: ', nextProps.treeData);
  //   this.setState({treeData: nextProps.treeData});
  // }

  render() {
    return (
        <div className="treePage">
          <D3Tree treeData={this.state.treeData} />
        </div>
      );
  }

  _onChange() {
    this.setState({ treeData: SongTreeStore.getTree() });
  }
}

export default Page;
