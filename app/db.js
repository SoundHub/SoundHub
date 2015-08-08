//db interaction
'use strict';

var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://SoundHub.sqlite');

/** SCHEMA **/

var SongNode = orm.define('songNodes', {
  title: { type: Sequelize.STRING, allowNull: false },
  like: { type: Sequelize.INTEGER, defaultValue: 0 },
  genre: { type: Sequelize.STRING, allowNull: true },
  data: { type: Sequelize.STRING, allowNull: true },
  forks: { type: Sequelize.INTEGER, defaultValue: 0 },
  author: { type: Sequelize.INTEGER, allowNull: false },
  path: { type: Sequelize.STRING, allowNull: false },
  // uri: { type: Sequelize.STRING, allowNull: false }  //when we have uris for songz
});

var User = orm.define('users', {
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  profilePic: { type: Sequelize.STRING, allowNull: false }
})

// Define the join table which joins Users and SongNodes
var Fork = orm.define('favorites', {
});

// Setup the many-many relationship through the orm
User.belongsToMany(SongNode, {
  through: Fork
});

SongNode.belongsToMany(User, {
  through: Fork,
  as: 'participants'
});


/** AUTH FUNCTIONS **/

var login = function(username, password) {

};

var signup = function(username, password) {
  Sequelize.User.findOne({
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
          Sequelize.User.create({
              username: username,
              password: hash
            }).then(function() {
              res.send('done');
            })
        })
      })
    } else {
      res.send('username already exists');
    }
  })
};

/** INSERT/QUERY FUNCTIONS **/

var addSong = function(title, genre, author, pathString, uri) {
  Sequelize.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      author: author,
      path: pathString //,
      // uri: uri             //when we have uris for songz
    });
  }).then(function(song) {
    console.log(song.get({
      plain: true
    }))
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

var myForks = function(userID, callback) {
  //gotta make a join table yo
}

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

var myFavs = function(userID, callback) {
  //gotta make a join table yo
};


exports.addSong = addSong;
exports.allSongs = allSongs;
exports.findSongsbyRoot = findSongsbyRoot;





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
