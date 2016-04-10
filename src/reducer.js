const defaultState = {
  appName: 'Conduit2',
  token: null
};

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case 'APP_LOAD':
      state.token = action.token || null;
      if (action.payload) {
        state.currentUser = action.payload.user;
      }
      state.appLoaded = true;
      break;
    case 'REDIRECT':
      state.redirectTo = null;
      break;
    case 'UPDATE_FIELD':
      state[action.key] = action.value;
      break;
    case 'HOME_PAGE_LOADED':
      state.tags = action.payload[0].tags;
      state.articles = action.payload[1].articles;
      state.tab = action.tab;
      break;
    case 'HOME_PAGE_UNLOADED':
      delete state.articles;
      delete state.tags;
      delete state.tab;
      break;
    case 'CHANGE_TAB':
      state.articles = action.payload.articles;
      state.tab = action.tab;
      break;
    case 'LOGIN':
    case 'REGISTER':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.token = action.payload.user.token;
        state.currentUser = action.payload.user;
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
