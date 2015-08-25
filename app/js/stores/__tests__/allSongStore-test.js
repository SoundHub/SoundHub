jest.dontMock('../allSongStore');
jest.dontMock('object-assign');

describe('allSongStore', () => {

  var Dispatcher;
  var SongStore;
  var callback;

  beforeEach(() => {
    Dispatcher = require('../../dispatcher/dispatcher');
    SongStore = require('../allSongStore');
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with dispatcher', () => {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });
})
