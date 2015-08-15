'use strict';
var express = require('express');
var server = express();
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

server.use(favicon(path.join(__dirname, '/assets', 'favicon.ico')));

server.use(function(req, res, next) {
  console.log(req.path);
  next();
});

server.use(bodyParser.json());

server.use('/s3', require('react-s3-uploader/s3router')({
    bucket: "soundhub",
    ACL: "public-read"
}));


/** DB ROUTES **/
var db = require('./db.js');

server.post('/login', function(req, res) {
  console.log('login request received!!!!!!!!!', req.body);
  db.login(req.body.username, req.body.password, function(response) {
    res.send(response);
  })
})

server.post('/signup', function(req, res) {
  console.log('signup request received!!!!!!!!!', req.body);
  var username = req.body.username
  var password = req.body.password
  db.signup(username, password, function(response) {
    res.send(response);
  });
})

server.post('/addSong', function(req, res) {  //** MVP **//
  var songData = req.body;
  console.log('server /addSong: ', songData.path);
  db.addSong(songData.title, songData.genre, songData.author, songData.path, songData.description, songData.url, function(response) {
    res.send(response);
  });
})

server.get('/allSongs', function(req, res) {  //** MVP **//
  db.allSongs(function(data) {
    res.send(data);
  });
})

server.post('/tree', function(req, res) {       //** MVP **//
  var rootId = req.body.rootId;
  db.findSongsbyRoot(rootId, function(data) {
    res.json(db.treeify(data));
  });
})

server.post('/mySongs', function(req, res) {   //** MVP **//
  var userId = req.body.userId;
  db.mySongs(userId, function(data) {
    res.send(data);
  })
})

server.post('/myForks', function(req, res) {  //** MVP **//
  var userId = req.body.userId;
  db.myForks(userId, function(data) {
    res.send(data);
  })
})

server.post('/myFavs', function(req, res) {
  var userId = 1; //req.body.userId
  db.myFavs(userId, function(data) {
    res.send(data);
  })
})

server.post('/addFork', function(req, res) { //** MVP **//
  var userId = req.body.userId;
  var songId = req.body.songId;
  db.addFork(userId, songId, function(forkData) {
    res.send('fork added');
  })
})

server.post('/addFav', function(req, res) {
  var userId = 2; //req.body.userId;
  var songId = 1; //req.body.songId;
  db.addFav(userId, songId, function(data) {
    res.send(data);
  })
})

server.post('/myVotes', function(req, res) {
  var userId = req.body.userId
  db.myVotes(userId, function(data) {
    console.log('derp');
    res.send(data);
  })
})

server.post('/addVote', function(req, res) {
  var vote = req.body.vote;
  var userId = req.body.userId;
  var songId = req.body.songId;
  db.addVote(vote, userId, songId, function(data) {
    console.log('data in server',data);
    res.send(data);
  })
})


/** END DB ROUTES **/


server.use('/', express.static(path.join(__dirname, '/build')));
server.use('/assets', express.static(path.join(__dirname, '/assets')));

server.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port', port);

module.exports = server;
