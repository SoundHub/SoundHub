//db interaction
'use strict';

var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://SoundHub.sqlite');
var bcrypt = require('bcrypt');
var promise = require('bluebird');
var compare = promise.promisify(bcrypt.compare);
var uuid = require('node-uuid');

/** SCHEMA **/

var SongNode = orm.define('songNodes', {
  title: { type: Sequelize.STRING, allowNull: false },
  like: { type: Sequelize.INTEGER, defaultValue: 0 },
  genre: { type: Sequelize.STRING, allowNull: true },
  forks: { type: Sequelize.INTEGER, defaultValue: 0 },
  author: { type: Sequelize.INTEGER, allowNull: false },
  authorName: { type: Sequelize.STRING, allowNull: true},
  authorPic: { type: Sequelize.STRING, allowNull: true},
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
  profilePic: { type: Sequelize.STRING, defaultValue: './assets/placeholder.jpg' }
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

var signup = function(username, password, email, callback) {
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
              password: hash,
              email: email
            }).then(function(userData) {
              response.userData = userData;
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

var getuser = function(userId, callback) {
  User.findOne(
    {where: {id: userId}}
  )
  .then(function(data) {
    callback(data);
  })
}

var updateUsername = function(userId, newname, callback) {
  User.update({
    username: newname
  }, {
    where: {
      id: userId
    }
  })
  .then(function() {
    SongNode.update(
    {authorName: newname}, 
    {where: {author: userId}}
    )
    .then(function(data) {
      callback(data);
    })
  })
}

var updateImg = function(userId, imgUrl, callback) {
  User.update({
    profilePic: imgUrl
  }, {
    where: {
      id: userId
    }
  })
  .then(function() {
    SongNode.update(
      {authorPic: imgUrl},
      {where: {author: userId}}
    )
    .then(function(data) {
      callback(data);
    })
  })
}

var updatePassword = function(userId, newPass, callback) {
  return bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.log(err);
      return;
    }
    bcrypt.hash(newPass, salt, function(err, hash) {
      User.update({
        password: hash
      }, {
        where: {
          id: userId
        }
      })
      .then(function(data) {
        callback(data);
      })
    })
  })
}


exports.orm = orm; //so testing suite can sync/drop test.sqlite
exports.login = login;
exports.signup = signup;
exports.getuser = getuser;
exports.updateUsername = updateUsername;
exports.updateImg = updateImg;
exports.updatePassword = updatePassword;


/** INSERT/QUERY FUNCTIONS **/


var addSong = function(title, genre, author, authorName, authorPic, description, url, rootId, parentId, callback) {
  var guid = uuid.v4();
  rootId = rootId || guid;
  parentId = parentId || null;
  orm.sync().then(function() {
    return SongNode.create({
      title: title,
      genre: genre,
      author: author,
      authorName: authorName,
      authorPic: authorPic,
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

var allSongSort = function(order, page, callback) {
  SongNode.findAll({
    offset: (page-1) * 24,
    limit: 24,
    order: order + ' DESC',
  }).then(function(data) {
    callback(data);
  })
}

var getNumSongs = function(callback) {
  orm.query('select count(*) from songNodes')
  .then(function(data) {
    var copy = data.slice(0,1);
    var count = copy[0][0]['count(*)'];
    callback(count);
  })
}

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
    'select distinct songNodes.title, songNodes.author, songNodes.authorName, songNodes.authorPic, songNodes.uuid, songNodes.genre, songNodes.description, songNodes.like, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
    'forks inner join users on forks.userId = '+userId+
    ' inner join songNodes on forks.songNodeId = songNodes.uuid;'
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
    'select distinct songNodes.title, songNodes.author, songNodes.authorName, songNodes.authorPic, songNodes.uuid, songNodes.genre, songNodes.description, songNodes.like, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
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
    'select distinct songNodes.title, songNodes.author, songNodes.uuid, songNodes.genre, songNodes.description, upvotes.upvote, songNodes.forks, songNodes.parentId, songNodes.rootId, songNodes.url from ' +
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
    if (data[1]) {
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
        if (data[0].dataValues.upvote !== voteVal) {
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
            callback(data); // chained from upvote.updat
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
exports.allSongSort = allSongSort;
exports.getNumSongs = getNumSongs;
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
          uuid: songNodeId
        }
      }
    )
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
