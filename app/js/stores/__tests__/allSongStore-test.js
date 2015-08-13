jest.dontMock('../allSongStore');

describe('songs object', function() {
 it('should be an object', function() {
   var AllSongStore = require('../allSongStore');
   var UserSongStore = require('../userSongStore');
   expect(AllSongStore.getAllSongs()).toBe({});
 });
});