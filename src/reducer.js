const defaultState = {
  appName: 'Conduit2',
  authed: false
};

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case 'REDIRECT':
      state.redirectTo = null;
      break;
    case 'UPDATE_FIELD':
      state[action.key] = action.value;
      break;
    case 'HOME_PAGE_LOADED':
      state.tags = action.payload.tags;
      break;
    case 'LOGIN':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.authed = true;
      }
      break;
  }

  return state;
};
