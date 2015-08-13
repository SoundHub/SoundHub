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

  describe('User table', function() {
    before(function(done) {
      return db.User.bulkCreate([{
        username:'suz',
        password: '123',
        email: 'suz@mks.com'
      }]).then(function() {
        return db.SongNode.create({
          title: 'runaway',
          like: 2,
          genre: 'electronic',
          forks: 3,
          author: 1,
          path: '/1/2/',
          url: 'whatever.aws.com/blah'
        }).then(function() {
        done();
        })
      })
    })

    // after(function(done) {
    //   db.orm.sync({force: true})
    //     .then(function() {
    //       done();
    //     })
    // })

    it('should retrieve values from users table', function(done) {
      var uri = 'http://localhost:3030/allSongs';
      request({'uri': uri, 'json': true}, function(err, res, body) {
        expect(body).to.be.an('array');
        expect(body[0].title).to.be.eql('runaway');
        done();
      })
    }); 

  })
});