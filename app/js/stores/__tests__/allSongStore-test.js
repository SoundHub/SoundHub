jest.dontMock('../allSongStore');
jest.dontMock('../../constants/constants');
jest.dontMock('object-assign');

var Constants = require('../../constants/constants');

describe('allSongStore', () => {

  var Dispatcher;
  var AllSongStore;
  var callback;
  const ActionType = Constants.ActionTypes;

  beforeEach(() => {
    Dispatcher = require('../../dispatcher/dispatcher');
    AllSongStore = require('../allSongStore');
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with dispatcher', () => {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });

  it('should receive songs', () => {
    var payload = {
      type: 'RECEIVE_ALL_SONGS_SORTED',
      songs: [{
        title: 'test1'
      }, {
        title: 'test2'
      }],
      number: 2
    }

    callback(payload);
    expect(AllSongStore.getSongNum()).toBe(2);
  })
})
