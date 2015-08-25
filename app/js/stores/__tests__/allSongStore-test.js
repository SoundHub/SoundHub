jest.dontMock('../allSongStore');
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

  it('receives songs to populate the front page', () => {
    var payload = {
      type: ActionType.RECEIVE_ALL_SONGS_SORTED,
      songs: {
        songs: [{
          title: 'test1',
          author: 'suzanne'
        }, {
          title: 'test2',
          author: 'jenny'
        }],
        number: 1
      }
    }

    callback(payload);
    var all = AllSongStore.getAllSongs();
    console.log(all);
  })
})
