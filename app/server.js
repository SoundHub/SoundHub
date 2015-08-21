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
  db.login(req.body.username, req.body.password, function(response) {
    res.send(response);
  })
})

server.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  db.signup(username, password, email, function(response) {
    res.send(response);
  });
})

server.post('/getuser', function(req, res) {
  var id = req.body.id;
  db.getuser(id, function(response) {
    res.send(response);
  })
})

server.post('/updateUsername', function(req, res) {
  var userId = req.body.userId;
  var newname = req.body.newname;
  db.updateUsername(userId, newname, function(data) {
    res.send(data);
  })
})

server.post('/updateImg', function(req, res) {
  var userId = req.body.userId;
  var imgUrl = req.body.imgUrl;
  db.updateImg(userId, imgUrl, function(data) {
    res.send(data);
  })
})

server.post('/updatePassword', function(req, res) {
  var userId = req.body.userId;
  var newPass = req.body.newPass;
  db.updatePassword(userId, newPass, function(data) {
    res.send(data);
  })
})

server.post('/addSong', function(req, res) {  //** MVP **//
  var songData = req.body;
  db.addSong(songData.title, songData.genre, songData.author,
    songData.authorName, songData.authorPic, songData.description,
    songData.url, songData.rootId, songData.parentId, function(response) {
    res.send(response);
  });
})

server.get('/allSongs', function(req, res) {  //** MVP **//
  db.allSongs(function(data) {
    res.send(data);
  });
})

server.post('/allSongSort', function(req, res) {
  var order = req.body.order;
  var page = req.body.page;
  var data = {songs: [], number: 0};
  db.allSongSort(order, page, function(songs) {
    data.songs = songs;
    db.getNumSongs(function(number) {
      data.number = number;
      res.send(data);
    })
  })
})

server.get('/numSongs', function(req, res) {
  db.getNumSongs(function(data) {
    res.send(data);
  })
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
  var userId = req.body.userId;
  db.myFavs(userId, function(data) {
    console.log(data)
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
  var userId = req.body.userId;
  var songId = req.body.songId;
  db.addFav(userId, songId, function(data) {
    res.send(data);
  })
})

server.post('/myVotes', function(req, res) {
  var userId = req.body.userId
  db.myVotes(userId, function(data) {
    res.send(data);
  })
})

server.post('/addVote', function(req, res) {
  var vote = req.body.vote;
  var userId = req.body.userId;
  var songId = req.body.songId;
  db.addVote(vote, userId, songId, function(data) {
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
