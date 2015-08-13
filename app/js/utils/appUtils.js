// central location for all communication with our api

import fetch from 'whatwg-fetch';

let rootUrl = ''
export default {
  get(url) {
    return window.fetch(url);
  },

  post(url, body) {
    var body = JSON.stringify(body);
    console.log('fetch post req: ', body)
    return window.fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    })
  }
}