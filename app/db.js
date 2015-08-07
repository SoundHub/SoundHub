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
  path: { type: Sequelize.STRING, allowNull: false }
});

var User = orm.define('users', {
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  profilePic: { type: Sequelize.STRING, allowNull: false }
})


/** INSERT/QUERY FUNCTIONS **/

var addSong = function(title, genre, author, pathString) {
  Sequelize.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      //data: { type: Sequelize.STRING, allowNull: false },
      author: author,
      path: pathString
    });
  }).then(function(song) {
    console.log(song.get({
      plain: true
    }))
  });
}

var findSongsbyRoot = function(rootNodeID, callback) {
  rootNodeID = rootNodeID.split('/')[1];
  SongNode.findAll({
  where: {
      path: { like: '%/' + rootNodeID + '/%'}
    }
})
  .then(function(data) {
    var treeNodes = []
    for (var i = 0; i < data.length; i++)
    treeNodes.push(data[i].get({plain: true}));
    callback(treeNodes);
  })
}

exports.addSong = addSong;
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
}

exports.treeify = treeify
