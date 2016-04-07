'use strict';

module.exports = store => next => action => {
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
    return;
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}
