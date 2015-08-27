var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var assert = require('assert');

process.env.DATABASE_URL = 'sqlite://test.sqlite';
process.env.TESTING = true;

var app = require('../app/server.js');
var db = require('../app/db.js');

var api_request = request.defaults({
  'jar': true,
  'baseUrl': 'http://localhost:3030' 
});

describe('API Integration:', function() {
  
  before(function(done) {
    var server = http.createServer(app);
    app.set('port', 3030);
    server.listen(3030);
    server.on('listening', function() {
      console.log('listening!');
      done();
    })
    server.on('error', function(error) {
      console.error(error);
    })
  });

  describe('Song functions', function() {

    after(function(done) {
      db.orm.sync({force: true})
        .then(function() {
          done();
        })
    })

    it('should create a song', function(done) {
      var uri = 'http://localhost:3030/addSong';
      request({
        uri: uri, 
        json: true,
        body: {
          title: 'bagfries',
          like: 2,
          genre: 'electronic',
          forks: 3,
          author: 1,
          path: '/1/2/',
          url: 'whatever.aws.com/blah'
        },
        method: 'post'
      }, function(err, res, body) {
        request({
          uri: 'http://localhost:3030/allSongs',
          method: 'get'
        }, function(err, res, body) {
          var songs = JSON.parse(res.body);
          expect(songs).to.be.an('array');
          expect(songs[0].title).to.be.eql('bagfries');
          done();
        })
      })
    })

    it('should return correct number of songs', function(done) {
      var uri = 'http://localhost:3030/addSong';
      request({
        uri: uri,
        json: true,
        method: 'post',
        body: {
          title: 'I want u back',
          like: 1,
          genre: 'folk',
          forks: 0,
          author: 1,
          path: '/1/2/',
          url: 'whatever.aws.com/test'
        }
      }, function(err) {
        console.log(err);
        request({
          uri: 'http://localhost:3030/allSongSort',
          method: 'post',
          json: true,
          body: {
            order: 'like',
            page: 1
          }
        }, function(err, res) {
          expect(res.body.number).to.be.eql(2);
          done();
        })
      })
    })

    it('should return songs correctly sorted by like', function(done) {
      var uri = 'http://localhost:3030/allSongSort';
      request({
        uri: uri,
        json: true,
        method: 'post',
        body: {
          order: 'like',
          page: 1
        }
      }, function(err, res) {
        var songsByLike = res.body.songs;
        expect(songsByLike[0].title).to.be.eql('bagfries');
        expect(songsByLike[1].title).to.be.eql('I want u back');
        done();
      })
    })

    it('should return songs correctly sorted by newest', function(done) {
      var uri = 'http://localhost:3030/allSongSort';
      request({
        uri: uri,
        json: true,
        method: 'post',
        body: {
          order: 'createdAt',
          page: 1
        }
      }, function(err, res) {
        var songsByNewest = res.body.songs;
        expect(songsByNewest[0].title).to.be.eql('I want u back');
        expect(songsByNewest[1].title).to.be.eql('bagfries');
        done();
      })
    })
  })

  describe('User profile functions', function() {
    
    after(function(done) {
      db.orm.sync({force: true})
      .then(function() {
        done();
      })
    })

    it('should sign up a user', function(done) {
      var uri = 'http://localhost:3030/signup';
      request({
        uri: uri,
        json: true,
        method: 'post',
        body: {
          username: 'suzanne',
          password: 'bagfries'
        }
      }, function(err, res, body) {
        console.log(err);
        request({
          uri: 'http://localhost:3030/getuser',
          method: 'post',
          json: true,
          body: {
            id: 1
          }
        }, function(err, res, body) {
          var username = res.body.username;
          var imgUrl = res.body.profilePic;
          expect(username).to.be.eql('suzanne')
          expect(imgUrl).to.be.eql('https://s3-us-west-2.amazonaws.com/soundhub/defaultImg.jpg')
          done();
        })
      })
    })

    it('should update user profile image', function(done) {
      var uri = 'http://localhost:3030/updateImg';
      request({
        uri: uri,
        method: 'post',
        json: true,
        body: {
          userId: 1,
          imgUrl: 'http://newimgurl.com'
        }
      }, function(err) {
        console.log(err);
        request({
          uri: 'http://localhost:3030/getuser',
          method: 'post',
          json: true,
          body: {
            id: 1
          }
        }, function(err, res, body) {
          var url = res.body.profilePic;
          expect(url).to.be.eql('http://newimgurl.com');
          done();
        })
      })
    })

    it('should update username', function(done) {
      var uri = 'http://localhost:3030/updateUsername';
      request({
        uri: uri,
        method: 'post',
        json: true,
        body: {
          userId: 1,
          newname: 'matt'
        }
      }, function(err) {
        console.log(err);
        request({
          uri: 'http://localhost:3030/getuser',
          method: 'post',
          json: true,
          body: {
            id: 1
          }
        }, function(err, res) {
          expect(res.body.username).to.be.eql('matt');
          done();
        })
      })
    })

    it('should update password', function(done) {
      var uri = 'http://localhost:3030/updatePassword';
      request({
        uri: uri,
        method: 'post',
        json: true,
        body: {
          userId: 1,
          newPass: 'algore7'
        }
      }, function(err) {
        console.log(err);
        request({
          uri: 'http://localhost:3030/login',
          method: 'post',
          json: true,
          body: {
            username: 'matt',
            password: 'algore7' 
          }
        }, function(err, res) {
          console.log(err);
          console.log('response: ', res.success)
          done();
        })
      })
    })
  })
});
