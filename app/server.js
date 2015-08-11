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

/** DB ROUTES **/
var db = require('./db.js');


server.get('/login', function(req, res) {
  db.login(req.body.username, req.body.password, function(response) {
    if (response.success) {
      req.session.user = response.user;
      req.session.save();
    }
    res.send(response.data);
  })
})

server.post('/signup', function(req, res) {
  var username = req.body.username
  var password = req.body.password
  db.signup(username, password, function(response) {
    res.send(response);
  });
})

server.post('/addSong', function(req, res) {  //** MVP **//
  var songData = req.body;
  db.addSong(songData.title, songData.genre, songData.author, songData.path, songData.description, songData.url, function(response) {
    res.send(response);
  });
})

server.get('/allSongs', function(req, res) {  //** MVP **//
  db.allSongs(function(data) {
    res.send(data);
  });
})

server.get('/tree', function(req, res) {       //** MVP **//
  var rootId = req.body.rootId;
  db.findSongsbyRoot(rootId, function(data) {   
    res.send(db.treeify(data));                
  });
})

server.get('/mySongs', function(req, res) {   //** MVP **//
  var userId = req.body.userId              
  db.mySongs(userId, function(data) {            
    res.send(data);
  })
})

server.get('/myForks', function(req, res) {  //** MVP **//
  var userId = req.body.userId
  db.myForks(userId, function(stuff) {
    res.send(stuff);
  })
})

server.post('/addFork', function(req, res) { //** MVP **//
  var userID = req.body.userId;
  var songID = req.body.songId;
  db.addFork(userId, songId, function(forkData) {
    console.log(forkData);
    res.send('fork added');
  })
})




/** END DB ROUTES **/

//** UPLOAD/DOWNLOAD/STREAM SONG METHDOS **//

server.get('/testSong', function(req, res) {
  res.sendFile(__dirname + '/songs/giveyouup.mp3')
})

//** END UP/DOWN/STREAM **//

server.use('/', express.static(path.join(__dirname, '/build')));
server.use('/assets', express.static(path.join(__dirname, '/assets')));

server.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port', port);
