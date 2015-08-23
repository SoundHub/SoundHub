'use strict';

import React from 'react';
import D3Tree from './tree.js';
import SongActions from '../actions/songActionCreators';
import SongTreeStore from '../stores/songTreeStore';
import Router from 'react-router';
import ModalStore from '../stores/modalStore';
import UserActionModal from './userActionModal';

class Page extends React.Component {
  constructor() {
    super();
    var query = window.location.pathname.split('/')[2];
    var rootId = query.split('&')[0];
    var uuid = query.split('&')[1];
    SongActions.getSongTree({rootId: rootId});  //'/1/'  '/1/2/'
    this.state = {
      treeData: {},
      uuid: uuid,
      actionModalVisible: false
    }

    SongTreeStore.getTree();

    this.componentWillMount = this.componentWillMount.bind(this);
    this.render = this.render.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onAction = this._onAction.bind(this);
    this.closeActionModal = this.closeActionModal.bind(this);
  }

  componentWillMount() {
    SongTreeStore.addChangeListener(this._onChange);
    ModalStore.addActionListener(this._onAction);
  }

  componentWillUnmount() {
    SongTreeStore.removeChangeListener(this._onChange);
    ModalStore.removeActionListener(this._onAction);
  }

  render() {
    return (
      <div className="treePage ">
        <UserActionModal show={this.state.actionModalVisible} message={this.state.actionMessage} onHide={this.closeActionModal} />
        <D3Tree treeData={this.state.treeData} uuid={this.state.uuid} />
      </div>
    );
  }

  _onChange() {
    this.setState({ treeData: SongTreeStore.getTree() });
  }

  _onAction() {
    this.setState({actionModalVisible: true, actionMessage: ModalStore.getActionMessage()})
    setTimeout(() => {
      this.closeActionModal();
    }, 500)
  }

  closeActionModal() {
    this.setState({actionModalVisible: false});
  }
}

export default Page;
