'use strict';

const agent = require('./agent');

exports.promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    action.payload.then(
      res => {
        console.log('RESULT', res);
        action.payload = res;
        store.dispatch(action);
      },
      error => {
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        store.dispatch(action);
      }
    );

    store.dispatch({ type: 'LOADING' });

    return;
  }

  next(action);
};

exports.localStorageMiddleware = store => next => action => {
  if (action.type === 'REGISTER' || action.type === 'LOGIN') {
    window.localStorage.setItem('jwt', action.payload.user.token);
    agent.setToken(action.payload.user.token);
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}
