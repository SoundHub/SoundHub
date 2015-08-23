
var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://SoundHub.sqlite');

function queryShit(uuid, parent) {
 orm.query('insert into songNodes(title, author, uuid, rootId, parentId, createdAt, updatedAt) values("a", "a", '+ ("" + uuid) +', 0, '+ ("" + parent) + ', "a", "a")')
}


orm.query('insert into users(username, password, createdAt, updatedAt) values ("topo", "topo", "topo", "topo")')
.then(function() {
    var ids = 0;
    queryShit(ids++, null);
    function intoTheWild(x) {
      var temp = x;
      if (x < 100) {
        queryShit(ids++, temp);
        intoTheWild();
        queryShit(ids++, temp);
        intoTheWild();
        queryShit(ids++, temp);
      }
    }
    intoTheWild(ids);
  })


