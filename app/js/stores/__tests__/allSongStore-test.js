
jest.dontMock('../allSongStore');
jest.dontMock('object-assign');
// jest.dontMock('../../constants/constants')

describe('allSongStore', () => {

  var Dispatcher;
  var AllSongStore;
  var callback;
  var Constants;
  var ActionType;

  beforeEach(() => {
    Dispatcher = require('../../dispatcher/dispatcher');
    AllSongStore = require('../allSongStore');
    Constants = require('../../constants/constants');
    ActionType = Constants.ActionTypes;
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with dispatcher', () => {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });

  it('should receive songs', () => {
    var payload = {
      type: ActionType.RECEIVE_ALL_SONGS_SORTED,
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
