//db interaction
'use strict';

var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://SoundHub.sqlite');
var bcrypt = require('bcrypt');
var promise = require('bluebird');
var compare = promise.promisify(bcrypt.compare);

/** SCHEMA **/

var SongNode = orm.define('songNodes', {
  title: { type: Sequelize.STRING, allowNull: false },
  like: { type: Sequelize.INTEGER, defaultValue: 0 },
  genre: { type: Sequelize.STRING, allowNull: true },
  forks: { type: Sequelize.INTEGER, defaultValue: 0 },
  author: { type: Sequelize.INTEGER, allowNull: false },
  path: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, defaultValue: '' },
  url: { type: Sequelize.STRING, allowNull: true }  //when we have urls for songz
});

var User = orm.define('users', {
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: true },
  profilePic: { type: Sequelize.STRING, allowNull: true }
});

// Define the join table which joins Users and 'forked' SongNodes
var Fork = orm.define('forks', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.INTEGER, allowNull: false}
});

// Define the join table which joins Users and 'favorited' SongNodes
var Favorite = orm.define('favorites', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.INTEGER, allowNull: false}
});

//Define the join table which joins Users and 'upvoted/downvoted' SongNodes
var Upvote = orm.define('upvotes', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.INTEGER, allowNull: false},
  upvote: { type: Sequelize.INTEGER, allowNull: true }
})

orm.sync();

/** AUTH FUNCTIONS **/

var login = function(username, password, callback) {
  var response = {};
  response.success = false;
  var hashedPw;
  var userObj;
  User.findAll({
    where: {
      username: username
    }
  }).then(function(obj) {
    userObj = obj;
    hashedPw = obj[0].dataValues.password;
  }).then(function(obj) {
    return compare(password, hashedPw)
      .then(function(data) { //data = bool from compare
        if (data) {
          response.user = userObj;
          response.success = true;
        }
        response.data = data;
        callback(response);
      })
  })
};

var signup = function(username, password, callback) {
  var response;
  var exists;
  User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    exists = user;
  }).then(function() {
    if(exists === null) {
      return bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          console.log(err);
          return;
        }
        bcrypt.hash(password, salt, function(err, hash) {
          User.create({
              username: username,
              password: hash
            }).then(function() {
              response = ('success');
            })
        })
      })
    } else {
      response = 'username already exists';
    }
  }).then(function() {
    callback(response);
  });
};


exports.login = login;
exports.signup = signup;


/** INSERT/QUERY FUNCTIONS **/

var addSong = function(title, genre, author, pathString, description, url, callback) {
  orm.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      author: author,
      path: pathString,
      description: description,
      url: url             //when we have uris for songz
    });
  }).then(function(song) {
    callback(song);
  });
};

var songCompiler = function(data) { //helper function to compile/clean queried songs
  var songs = [];
  for (var i = 0; i < data.length; i++) {
    songs.push(data[i].get({plain: true}));
  }
  return songs;
}

var allSongs = function(callback) {
  SongNode.findAll({
  })
  .then(function(data) {
    var songs = songCompiler(data);
    callback(songs);
  })
};

var findSongsbyRoot = function(rootNodeID, callback) {
  console.log('fuck fuck: ', rootNodeID);
  rootNodeID = rootNodeID.split('/')[1];
  console.log('fuck fuck fuck: ', rootNodeID);
  SongNode.findAll({
  where: {
      path: { like: '%/' + rootNodeID + '/%' }
    }
  })
  .then(function(data) {
    var treeNodes = songCompiler(data);
    callback(treeNodes);
  })
};

var mySongs = function(userID, callback) {
  SongNode.findAll({
    where: {
      author: userID
    }
  })
  .then(function(data) {
    var mySongs = songCompiler(data);
    callback(mySongs);
  })
};

var myForks = function(userId, callback) {
  orm.query(
    'select songNodes.title, songNodes.author from ' +
    'forks join users on forks.userId = '+userId+
    ' join songNodes on forks.songNodeId = songNodes.id;'
  ).then(function(data) {
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addFork = function(userId, songNodeId, callback) {
  Fork.create({
    userId: userId,
    songNodeId: songNodeId
  })
  .then(function(forkData) {
    callback(forkData);
  });
};

var myFavs = function(userId, callback) {  //I AM NOT MVP
  orm.query(
    'select songNodes.title, songNodes.author from ' +
    'favorites join users on favorites.userId = '+userId+
    ' join songNodes on favorites.songNodeId = songNodes.id;'
  ).then(function(data) {
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addFav = function(userId, songNodeId, callback) {
  Favorite.create({
    userId: userId,
    songNodeId: songNodeId
  })
  .then(function(forkData) {
    callback(forkData);
  });
};

var myVotes = function(userId, callback) {
  orm.query(
    'select songNodes.id, upvotes.upvote from ' +
    'upvotes join users on upvotes.userId = '+userId+
    ' join songNodes on upvotes.songNodeId = songNodes.id;'
  ).then(function(data) {
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addVote = function(voteVal, userId, songNodeId, callback) {
  Upvote.findOne({
    where: {
      userId: userId,
      songNodeId: songNodeId
    }
  })
  .then(function(data) {
    console.log('some data: ', data);
    if (data) {
      console.log(data.dataValues.upvote, voteVal);
    } else {
      console.log('found');
    }
    Upvote.create({
      upvote: voteVal,
      userId: userId,
      songNodeId: songNodeId
    })
    .then(function(forkData) {
      callback(forkData);
    })
  })
}


exports.addSong = addSong;
exports.allSongs = allSongs;
exports.findSongsbyRoot = findSongsbyRoot;
exports.mySongs = mySongs;
exports.myForks = myForks;
exports.addFork = addFork;
exports.myFavs = myFavs;
exports.addFav = addFav;
exports.myVotes = myVotes;
exports.addVote = addVote;

/* BUILD TREE FROM FLATTENED ARRAY, PROBS FOR FRONT END */

//this should be optimized, currently O(n^2)
var treeify = function(nodesArray) {
  var tree;
  console.log(nodesArray);
  //determine root node
  for (var i = 0, j = nodesArray.length; i < j; i++) {
    var pathArr = nodesArray[i].path.split('/');
    nodesArray[i].parent = pathArr[pathArr.length - 3];
    nodesArray[i].children = [];
    if (!tree) {
      if (nodesArray[i].parent === '') {
        tree = nodesArray[i];
      }
    }
  }
  //recursively build and traverse tree
  function depthFirstFill(node) {
    if(node) {
      for (var i = 0; i < nodesArray.length; i++) {
        if (parseInt(nodesArray[i].parent) === node.id) {
          node.children.push(nodesArray[i]);
        }
      }
      for (var i = 0; i < node.children.length; i++) {
        depthFirstFill(node.children[i]);
      }
    }
  }
  depthFirstFill(tree);
  return tree;
};

exports.treeify = treeify
