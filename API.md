__________________________________________________________________________________________
*login*
x.x.x.x/login
requires username as req.body.username .........................................  //string
requires password as req.body.password .........................................  //string

returns
{
  success: bool,
  user: {
    id: uid of user //int
  }
}
__________________________________________________________________________________________
*signup*
x.x.x.x/signup
requires username as req.body.username .........................................  //string
requires password as req.body.password .........................................  //string

returns 'success' or 'username already exists'
__________________________________________________________________________________________
*add song*
x.x.x.x/addSong
requires title as req.body.title ...............................................  //string
requires genre as req.body.genre ...............................................  //string
requires author as req.body.author .............................................  //int(uid)
requires path as req.body.path .................................................  //string
requires description as req.body.description ...................................  //string
requires url as req.body.url ...................................................  //string

returns 
{
  title: 'song title',
  genre: 'song genre',
  author: (int of users uid),
  path: '/song/path/',
  description: 'song description',
  url: 'www.urlOfSong.com'
}
__________________________________________________________________________________________
*get all songs*
x.x.x.x/allSongs
requires NOTHING!!! ............................................................  //dance

returns array as
[{
  title: 'song title',
  genre: 'song genre',
  author: (int of users uid),
  path: '/song/path/',
  description: 'song description',
  url: 'www.urlOfSong.com'
}...]
__________________________________________________________________________________________
*get song tree*
x.x.x.x/tree
requires root ID of tree as req.body.rootId ....................................  //string

returns tree as
{
  title: 'song title',
  genre: 'song genre',
  author: (int of users uid),
  path: '/song/path/',
  description: 'song description',
  url: 'www.urlOfSong.com',
  parent: (string of uid of parent node, '' for rootNode),
  children: [nested objects of same props]
}
__________________________________________________________________________________________
*get songs added by user*
x.x.x.x/mySongs
requires uid of user as req.body.userId ........................................  //int

returns array as 
[{
  title: 'song title',
  genre: 'song genre',
  author: (int of users uid),
  path: '/song/path/',
  description: 'song description',
  url: 'www.urlOfSong.com'
}...]
__________________________________________________________________________________________
*get a users forked songs*
x.x.x.x/myForks
requires uid of user as req.body.userId ........................................  //int

returns array as 
[{
  title: 'song title',
  genre: 'song genre',
  author: (int of users uid),
  path: '/song/path/',
  description: 'song description',
  url: 'www.urlOfSong.com'
}...]
__________________________________________________________________________________________
*add a song to users forks*
x.x.x.x/addFork
requires uid of user as req.body.userId ........................................  //int
requires uid of song as req.body.songId ........................................  //int

returns 'fork added'
__________________________________________________________________________________________
