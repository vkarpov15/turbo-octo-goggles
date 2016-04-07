'use strict';

const superagent =
  require('superagent-promise')(require('superagent'), global.Promise);

const API_ROOT = 'https://conduit.productionready.io/api';

const responseBody = res => res.body;
const requests = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};

const Auth = {
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

module.exports = {
  Auth,
  Tags
};
