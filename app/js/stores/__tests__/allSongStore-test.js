jest.dontMock('../allSongStore');
jest.dontMock('object-assign');

describe('allSongStore', () => {

  var Dispatcher;
  var AllSongStore;
  var callback;

  beforeEach(() => {
    Dispatcher = require('../../dispatcher/dispatcher');
    AllSongStore = require('../allSongStore');
    callback = Dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with dispatcher', () => {
    expect(Dispatcher.register.mock.calls.length).toBe(1);
  });
})



// describe('UnreadThreadStore', function() {

//   var ChatAppDispatcher;
//   var UnreadThreadStore;
//   var callback;

//   beforeEach(function() {
//     ChatAppDispatcher = require('../../dispatcher/ChatAppDispatcher');
//     UnreadThreadStore = require('../UnreadThreadStore');
//     callback = ChatAppDispatcher.register.mock.calls[0][0];
//   });

//   it('registers a callback with the dispatcher', function() {
//     expect(ChatAppDispatcher.register.mock.calls.length).toBe(1);
//   });

//   it('provides the unread thread count', function() {
//     var ThreadStore = require('../ThreadStore');
//     ThreadStore.getAll.mockReturnValueOnce(
//       {
//         foo: {lastMessage: {isRead: false}},
//         bar: {lastMessage: {isRead: false}},
//         baz: {lastMessage: {isRead: true}}
//       }
//     );
//     expect(UnreadThreadStore.getCount()).toBe(2);
//   });

// });
// describe('CheckboxWithLabel', () => {

//   it('changes the text after click', () => {

//     // Render a checkbox with label in the document
//     var checkbox = TestUtils.renderIntoDocument(
//       <CheckboxWithLabel labelOn="On" labelOff="Off" />
//     );

//     var checkboxNode = React.findDOMNode(checkbox);

//     // Verify that it's Off by default
//     expect(checkboxNode.textContent).toEqual('Off');

//     // Simulate a click and verify that it is now On
//     TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, 'input'));
//     expect(checkboxNode.textContent).toEqual('On');
//   });

// });

// jest.dontMock('../UnreadThreadStore');
// jest.dontMock('object-assign');
