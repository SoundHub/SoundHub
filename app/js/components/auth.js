'use strict';
import React from 'react';
import Router from 'react-router';
import Carcousel from './carcousel'

class Auth extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className = "authPage">
        <div className = "Carcouselbox">
          <Carcousel bsSize="small"/>
        </div>
        <div className="seemore">Scroll down for more details</div>

        <div className="developerBigTitle">OUR TEAM</div>
        <div className="developerContainer">
          <div className="developerBox">
          <img className="developerImg" src="../assets/matt.png"></img>
            <div className="developerTitle">Matt Topolski</div>
            <div className="developerSubTitle">Product Owner</div>
          </div>

          <div className="developerBox">
          <img className="developerImg" src="../assets/james.jpg"></img>
            <div className="developerTitle">James Larrenaga</div>
            <div className="developerSubTitle">Full Stack Developer</div>
          </div>

          <div className="developerBox">
          <img className="developerImg" src="../assets/mike.jpg"></img>
            <div className="developerTitle">Mikhail Shnayder</div>
            <div className="developerSubTitle">Scrum Master</div>
          </div>

          </div>
          <div className="techBigTitle">TECH STACK</div>
          <div>

          <div className ="techContainer">

          <div className="techBox">
          <img className="techImg" src="../assets/ecmascript6-logo.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/react.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/flux.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/d3.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/node.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/expresslogo.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/gulp.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/SQLite.png"></img>
          </div>

          <div className="techBox">
          <img className="techImg" src="../assets/S3.png"></img>
          </div>

          </div>


        </div>
        <img className="gitImg" src="../assets/GitHub-Mark-120px-plus.png"></img>
        <div className="gitBigTitle">
        <div className="gitLinkContainer">

          <a className="gitLink" href="https://github.com/SoundHub/SoundHub" target="_blank">https://github.com/SoundHub/SoundHub</a>
        </div>
        </div>

        

      </div>
    );
  }
}

export default Auth;
