'use strict';

const superagent =
  require('superagent-promise')(require('superagent'), global.Promise);

const API_ROOT = 'https://conduit.productionready.io/api';

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
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

const Articles = {
  feed: () => requests.get('/articles/feed?limit=10&offset=0')
};

module.exports = {
  Articles,
  Auth,
  Tags,
  setToken: _token => { token = _token; }
};
