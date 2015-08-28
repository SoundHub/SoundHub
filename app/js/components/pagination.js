'use strict';
import React from 'react';
import Router from 'react-router';
import SongActions from '../actions/songActionCreators';
import { Pagination } from 'react-bootstrap';


class PageNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event, selectedEvent){
    this.setState({
      activePage: selectedEvent.eventKey
    });
    SongActions.getAllSongsSorted(this.props.order, selectedEvent.eventKey)
  }

  render() {
    return (
      <Pagination
        className="pageNav"
        prev next first last ellipsis
        bsSize='small'
        items={this.props.pages}
        maxButtons={5}
        activePage={this.state.activePage}
        onSelect={this.handleSelect} />
    )
  } 
};

export default PageNav;