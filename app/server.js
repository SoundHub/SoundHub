'use strict';
var express = require('express');
var server = express();
var path = require('path');




server.use(function(req, res, next) {
  console.log(req.path);
  next();
});


/** DB ROUTES **/
var db = require('./db.js');


server.post('/login', function(req, res) {

})

server.post('/signup', function(req, res) {

})

server.post('/addSong', function(req, res) {
  var songData = req.body;
  db.addSong(songData.title, songData.genre, songData.author, songData.path)
})

server.get('/allSongs', function(req, res) {
  db.allSongs(function(data) {
    res.send(data);
  });
})

server.get('/tree', function(req, res) {       //NEED ROOTNODE ID
  db.findSongsbyRoot('/1/', function(data) {   //INSTEAD OF '/1/'
    res.send(db.treeify(data));                //BUT IN THAT FORMAT (req.body.path === '/x/')
  });
})


server.get('/mySongs', function(req, res) {

})

server.get('/myForks', function(req, res) {
  
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
