// central location for all communication with our api

import fetch from 'whatwg-fetch';

let rootUrl = '';
export default {
  get(url) {
    return window.fetch(url);
  },

  getTree(url, body) {
    var body = JSON.stringify(body);

    return new Promise(function(resolve, reject) {
      window.fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })
      .then((response) => {
        response.json()
        .then(function(json) {
          resolve(json);
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  },

  postJSON(url, body) {
    var body = JSON.stringify(body);
    return new Promise(function(resolve, reject) {
      console.log('send userID'+ body)
      window.fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })
      .then((response) => {
        response.json()
        .then(function(json) {
          resolve(json);
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  },

  simplePost(url, body) {
    var body = JSON.stringify(body);
    return new Promise(function(resolve, reject) {
      window.fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })
      .then((response) => {
          console.log('hi1')
          resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  }
};
