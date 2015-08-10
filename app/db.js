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
  description: { type: Sequelize.STRING, defaultValue: 'This person didn\'t care enough to put a description in' }
  // url: { type: Sequelize.STRING, allowNull: false }  //when we have urls for songz
});

var User = orm.define('users', {
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: true },
  profilePic: { type: Sequelize.STRING, allowNull: true }
});

// Define the join table which joins Users and SongNodes
var Fork = orm.define('forks', {
});

// Setup the many-many relationship through the orm
User.belongsToMany(SongNode, {
  through: Fork
});

SongNode.belongsToMany(User, {
  through: Fork
});

orm.sync();

/** AUTH FUNCTIONS **/

var login = function(username, password, callback) {
  var response = {};
  response.success = false;
  var hashedPw;
  var userObj;
  sequelize.User.findAll({
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
              response = ('done');
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

module.exports.login = login;
module.exports.signup = signup;

/** INSERT/QUERY FUNCTIONS **/

var addSong = function(title, genre, author, pathString, callback) {
  orm.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      author: author,
      path: pathString //,
      // uri: uri             //when we have uris for songz
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
    where: {
      path: { like: '%' }
    }
  })
  .then(function(data) {
    var songs = songCompiler(data);
    callback(songs);
  })
};

var findSongsbyRoot = function(rootNodeID, callback) {
  rootNodeID = rootNodeID.split('/')[1];
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



var myForks = function(userID, callback) {
  //gotta make a join table yo
  User.findOne({
    where: {
      id: userID
    }
  })
  .then(function(userObj) {
    console.log(userObj);
    userObj.getSongNodes()
  })
  .then(function(stuff) {
    console.log(stuff);
    callback(stuff);
  })
};


var myFavs = function(userID, callback) {  //I AM NOT MVP
  //gotta make a join table yo             //I AM A LEAF ON THE WIND
};


exports.addSong = addSong;
exports.allSongs = allSongs;
exports.findSongsbyRoot = findSongsbyRoot;
exports.mySongs = mySongs;
exports.myForks = myForks;




/* BUILD TREE FROM FLATTENED ARRAY, PROBS FOR FRONT END */

//this should be optimized, currently O(n^2)
var treeify = function(nodesArray) {
  var tree;
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
    for (var i = 0; i < nodesArray.length; i++) {
      if (parseInt(nodesArray[i].parent) === node.id) {
        node.children.push(nodesArray[i]);
      }
    }
    for (var i = 0; i < node.children.length; i++) {
      depthFirstFill(node.children[i]);
    }
  }
  depthFirstFill(tree);
  return tree;
};

exports.treeify = treeify
