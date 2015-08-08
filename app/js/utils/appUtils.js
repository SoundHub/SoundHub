// central location for all communication with our api

import fetch from 'whatwg-fetch';

let rootUrl = ''
export default {
  get(url) {
    return window.fetch(url, {
      method: 'get'
    });
  },

  post(url, body) {
    return fetch(url, {
      method: 'post',
      body: body
    })
    .then((response) => {
      console.log(response);
    })
  }
}