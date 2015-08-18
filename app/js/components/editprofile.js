'use strict';
import React from 'react';
import UserImgStore from '../stores/userImgStore';
import ReactS3Uploader from 'react-s3-uploader';
import UserActions from '../actions/userActionCreators';

class Edit extends React.Component {
  constructor() {
    super();
    this.save = this.save.bind(this);
    this.onUploadFinish = this.onUploadFinish.bind(this);
    this.state ={
      updateimg:false,
      imageUrl:''
    }
  }

  save(){
    let newName = this.refs.username.getDOMNode().value
    if(newName){
      console.log(newName);
      console.log('id:'+ this.props.userId)
      UserActions.updateUsername(this.props.userId,newName)
      //call backend to update username
    }
    if(this.state.updateimg){
      console.log('id:'+ this.props.userId)
      UserActions.updateImg(this.props.userId,this.state.imageUrl)
      console.log('update image' + this.state.imageUrl);
      //call backend to update profileImg
    }
  }

  onUploadFinish(result) {
    var url = 'https://s3-us-west-2.amazonaws.com/soundhub/' + result.filename
    UserActions.changeProfile(url);
    this.setState({imageUrl:url}, ()=>{
      this.setState({updateimg:true})
    })
  }

  render() {
    return (
      <div className="boxed-group-profile">
          <div className="pageTitle">Profile</div>
              <div className="edit-profile-avatar">
                <button className="fileupload btn btn-success">
                  <span>Choose Pic</span>
                  <ReactS3Uploader
                      className="upload"
                      signingUrwl="/s3/sign"
                      accept="image/*"
                      onProgress={this.onUploadProgress}
                      onError={this.onUploadError}
                      onFinish={this.onUploadFinish} />
                </button>

                <div className="edit-profile">
                <div>Name</div>
                  <input classNameName="profile-input" ref="username" type="text" placeholder={this.props.username}></input>
                </div>
                <button onClick={this.save} className="btn btn-success">SAVE</button>
              </div>
      </div>
    );
  }
}

export default Edit;
