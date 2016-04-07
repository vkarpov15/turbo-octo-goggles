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
    case 'HOME_PAGE_UNLOADED':
      delete state.tags;
      break;
    case 'LOGIN':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.authed = true;
      }
      break;
    case 'REGISTER':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.authed = true;
      }
      break;
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      for (const key of ['errors', 'username', 'email', 'password']) {
        delete state[key];
      }
      break;
  }

  return state;
};
