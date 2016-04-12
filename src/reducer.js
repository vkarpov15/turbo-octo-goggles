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
    case 'ADD_TAG':
      state.tagList.push(state.tagInput);
      state.tagInput = '';
      break;
    case 'REMOVE_TAG':
      const index = state.tagList.indexOf(action.tag);
      if (index !== -1) {
        array.splice(state.tagList, index);
      }
      break;
    case 'EDITOR_PAGE_LOADED':
      state.title = '';
      state.description = '';
      state.body = '';
      state.tagInput = '';
      state.tagList = [];
      break;
    case 'EDITOR_PAGE_UNLOADED':
      delete state.title;
      delete state.description;
      delete state.body;
      delete state.tagInput;
      delete state.tagList;
      delete state.errors;
      break;
    case 'ARTICLE_SUBMITTED':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        console.log('should redirect to', action.payload.article.slug);
      }
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
