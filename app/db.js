//db interaction
'use strict';

var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://SoundHub.sqlite');
var bcrypt = require('bcrypt');
var promise = require('bluebird');
var compare = promise.promisify(bcrypt.compare);
var uuid = require('node-uuid');

console.log(typeof uuid.v4());
for (var i = 0; i < 10; i++) {
  console.log(uuid.v4());
}

/** SCHEMA **/

var SongNode = orm.define('songNodes', {
  title: { type: Sequelize.STRING, allowNull: false },
  like: { type: Sequelize.INTEGER, defaultValue: 0 },
  genre: { type: Sequelize.STRING, allowNull: true },
  forks: { type: Sequelize.INTEGER, defaultValue: 0 },
  author: { type: Sequelize.INTEGER, allowNull: false },
  description: { type: Sequelize.STRING, defaultValue: '' },
  url: { type: Sequelize.STRING, allowNull: true },
  uuid: { type: Sequelize.STRING, allowNull: false},
  rootId: { type: Sequelize.STRING, allowNull: false },
  parentId: { type: Sequelize.STRING, allowNull: true }
});

var User = orm.define('users', {
  username: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: true },
  profilePic: { type: Sequelize.STRING, defaultValue: 'https://s3-us-west-2.amazonaws.com/soundhub/defaultImg.jpg' }
});

// Define the join table which joins Users and 'forked' SongNodes
var Fork = orm.define('forks', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.STRING, allowNull: false}
});

// Define the join table which joins Users and 'favorited' SongNodes
var Favorite = orm.define('favorites', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.STRING, allowNull: false}
});

//Define the join table which joins Users and 'upvoted/downvoted' SongNodes
var Upvote = orm.define('upvotes', {
  userId: { type: Sequelize.INTEGER, allowNull: false },
  songNodeId: { type: Sequelize.STRING, allowNull: false},
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
        }
        response.success = data;
        callback(response);
      })
  })
};

var signup = function(username, password, callback) {
  var response = {};
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
              response.success = true;
              callback(response);

            })
        })
      })
    } else {
      response.success = false;
      callback(response);
    }
  })
};


exports.login = login;
exports.signup = signup;


/** INSERT/QUERY FUNCTIONS **/

var addSong = function(title, genre, author, description, url, rootId, parentId, callback) {
  var guid = uuid.v4();
  rootId = rootId || guid;
  parentId = parentId || null;
  orm.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      author: author,
      description: description,
      url: url,
      uuid: guid,
      rootId: rootId,
      parentId: parentId
    });
  }).then(function(song) {
    callback(song);
  });
};

var allSongs = function(callback) {
  SongNode.findAll({
  })
  .then(function(data) {
    var songs = songCompiler(data);
    callback(songs);
  })
};

var findSongsbyRoot = function(rootNodeId, callback) {
  // rootNodeID = rootNodeID.split('/')[1];
  SongNode.findAll({
  where: {
      rootId: rootNodeId
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
    'select distinct songNodes.title, songNodes.author, songNodes.uuid, songNodes.genre, songNodes.description, songNodes.like, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
    'forks inner join users on forks.userId = '+userId+
    ' inner join songNodes on forks.songNodeId = songNodes.uuid;'
  ).then(function(data) {
    console.log(data);
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addFork = function(userId, songNodeId, callback) {
  Fork.create({
    userId: userId,
    songNodeId: songNodeId
  })
  .then(function(forkData) {
    SongNode.update(
      {
        forks: Sequelize.literal('forks +1')
      },
      {
        where: {
          uuid: songNodeId
        }
      }
    )
    callback(forkData);
  });
};

var myFavs = function(userId, callback) {  //I AM NOT MVP
  orm.query(
    'select distinct songNodes.title, songNodes.author, songNodes.uuid, songNodes.genre, songNodes.description, songNodes.like, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
    'favorites join users on favorites.userId = '+userId+
    ' join songNodes on favorites.songNodeId = songNodes.uuid;'
  ).then(function(data) {
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addFav = function(userId, songNodeId, callback) {
  Favorite.findOrCreate({
    where: {
      userId: userId,
      songNodeId: songNodeId
    }
  })
  .then(function(forkData) {
    callback(forkData);
  });
};

var myVotes = function(userId, callback) {
  orm.query(
    'select distinct songNodes.title, songNodes.author, songNodes.uuid, songNodes.genre, songNodes.description, songNodes.like, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
    'upvotes join users on upvotes.userId = '+userId+
    ' join songNodes on upvotes.songNodeId = songNodes.uuid;'
  ).then(function(data) {
    callback(data.slice(0, (data.length - 1))[0]);
  })
};

var addVote = function(voteVal, userId, songNodeId, callback) {
  Upvote.findOrCreate({
    where: {
      userId: userId,
      songNodeId: songNodeId
    }
  })
  .then(function(data) {
    console.log('data',data);
    if (data[1]) {
      console.log('created');
      Upvote.update({
          upvote: voteVal
        }, {
          where: {
           userId: userId,
           songNodeId: songNodeId,
          }
        }
      )
      .then(function(data) {
        updateVotes(songNodeId);
        callback(data); // chained from upvote.update
      })
    } else {
        console.log('existed already');
        if (data[0].dataValues.upvote !== voteVal) {
          console.log('existed but needed updating');
          Upvote.update({
              upvote: voteVal
            }, {
              where: {
               userId: userId,
               songNodeId: songNodeId,
              }
            }
          )
          .then(function(data) {
            updateVotes(songNodeId);
            callback(data); // chained from upvote.update
          })
        } else {
          callback(data)
        }
      }
  })
}


//*************************EXPORTS**************************//

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



//*********************HELPER FUNCTIONS**********************//


/* UPDATE SONG WITH LIKES TOTAL AFTER LIKE */
var updateVotes = function(songNodeId) {
  Upvote.findAll({
    where: {
      songNodeId: songNodeId
    }
  })
  .then(function(data){
    var voteSum = 0;
    for (var x in data) {
      voteSum += data[x].dataValues.upvote
    }
    SongNode.update({
        like: voteSum
      }, {
        where: {
          id: songNodeId
        }
      }
    )
    console.log(voteSum);
  })
}

/* COMPILE/CLEAN QUERIED SONGS */
var songCompiler = function(data) {
  var songs = [];
  for (var i = 0; i < data.length; i++) {
    songs.push(data[i].get({plain: true}));
  }
  return songs;
}

/* BUILD TREE FROM FLATTENED ARRAY */

//this should be optimized, currently O(n^2)
var treeify = function(nodesArray) {
  var tree;
  //determine root node
  for (var i = 0, j = nodesArray.length; i < j; i++) {
    nodesArray[i].children = [];
    if (!tree) {
      if (nodesArray[i].parentId === null) {
        tree = nodesArray[i];
      }
    }
  }
  //recursively build and traverse tree
  function depthFirstFill(node) {
    if(node) {
      for (var i = 0; i < nodesArray.length; i++) {
        if (nodesArray[i].parentId === node.uuid) {
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
