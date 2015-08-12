'use strict';
import React from 'react';
import {Carousel,CarouselItem} from 'react-bootstrap';

const ControlledCarousel = React.createClass({
  getInitialState() {
    return {
      index: 0,
      direction: null
    };
  },

  handleSelect(selectedIndex, selectedDirection) {
    this.setState({
      index: selectedIndex,
      direction: selectedDirection
    });
  },

  render() {
    return (
      <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
        <CarouselItem>
          <img className="banner" src='/assets/authbanner.jpg'/>
          <div className='carousel-caption'>
            <div className="bannerTitle">Github for Music</div>
            <p className="bannerText">Collaborate with musicians across the world or across the street.</p>
          </div>
        </CarouselItem>
        <CarouselItem>
          <img className="banner" src='/assets/album/5.png'/>
        </CarouselItem>
      </Carousel>
    );
  }
});



export default ControlledCarousel;
