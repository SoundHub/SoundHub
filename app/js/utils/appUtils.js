// central location for all communication with our api

import fetch from 'whatwg-fetch';

export default {
  get(url) {
    return fetch(url, {
      method: 'get'
    })
    .then((response) => {
      console.log(response);
    })
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