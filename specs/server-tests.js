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

    // after(function(done) {
    //   db.orm.sync({force: true})
    //     .then(function() {
    //       done();
    //     })
    // })

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
        db.allSongs(function(song) {
          expect(song).to.be.an('array');
          expect(song[0].title).to.be.eql('bagfries');
          done();
        })
      })
    });

    it('should sign up a user', function(done) {
      var uri = 'http://localhost:3030/signup';
      request({
        uri: uri,
        json: true,
        method: 'post',
        body: {
          username: 'suz',
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
          expect(username).to.be.eql('suz')
          done();
        })
      })
    })

    // it('should log a signed up user in', function(done) {
    //   var uri = 'http://localhost:3030/login';
    //   request({
    //     uri: uri,
    //     json: true,
    //     method: 'post',
    //     body: {
    //       username: 'suz',
    //       password: 'bagfries'
    //     }
    //   }, function(err, res, body) {
    //     console.log('response: ', response)
    //     done();
    //   })
    // })

  })
});