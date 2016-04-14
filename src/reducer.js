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
    case 'ARTICLE_PAGE_LOADED':
      state.article = action.payload[0].article;
      state.comments = action.payload[1].comments;
      break;
    case 'DELETE_ARTICLE':
      state.redirectTo = '/';
      break;
    case 'ARTICLE_PAGE_UNLOADED':
      delete state.article;
      delete state.comments;
      delete state.commentErrors;
      break;
    case 'HOME_PAGE_LOADED':
      state.tags = action.payload[0].tags;
      state.articles = action.payload[1].articles;
      state.articlesCount = action.payload[1].articlesCount;
      state.currentPage = 0;
      state.tab = action.tab;
      break;
    case 'HOME_PAGE_UNLOADED':
      delete state.articles;
      delete state.tags;
      delete state.tab;
      delete state.articlesCount;
      delete state.currentPage;
      break;
    case 'SET_PAGE':
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.currentPage = action.page;
      break;
    case 'ARTICLE_FAVORITED':
    case 'ARTICLE_UNFAVORITED':
      state.articles.forEach(article => {
        if (article.slug === action.payload.article.slug) {
          article.favorited = action.payload.article.favorited;
          article.favoritesCount = action.payload.article.favoritesCount;
        }
      });
      break;
    case 'ADD_TAG':
      state.tagList.push(state.tagInput);
      state.tagInput = '';
      break;
    case 'REMOVE_TAG':
      const index = state.tagList.indexOf(action.tag);
      if (index !== -1) {
        state.tagList.splice(index, 1);
      }
      break;
    case 'ADD_COMMENT':
      if (action.error) {
        state.commentErrors = action.payload.errors;
      } else {
        state.comments = state.comments || [];
        state.comments.unshift(action.payload.comment);
      }
      break;
    case 'DELETE_COMMENT':
      const filter = comment => comment.id !== action.commentId;
      state.comments = _.filter(state.comments, filter);
      break;
    case 'EDITOR_PAGE_LOADED':
      if (action.payload) {
        state.articleSlug = action.payload.article.slug;
        state.title = action.payload.article.title;
        state.description = action.payload.article.description;
        state.body = action.payload.article.body;
        state.tagInput = '';
        state.tagList = action.payload.article.tagList;
      } else {
        state.title = '';
        state.description = '';
        state.body = '';
        state.tagInput = '';
        state.tagList = [];
      }
      break;
    case 'EDITOR_PAGE_UNLOADED':
      const keys = [
        'title',
        'description',
        'body',
        'tagInput',
        'tagList',
        'errors',
        'articleSlug'
      ];
      for (const key of keys) {
        delete state[key];
      }
      break;
    case 'ARTICLE_SUBMITTED':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = `article/${action.payload.article.slug}`;
      }
      break;
    case 'CHANGE_TAB':
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.tab = action.tab;
      state.currentPage = 0;
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
    case 'SETTINGS_SAVED':
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = '/';
        state.currentUser = action.payload.user;
      }
      break;
    case 'SETTINGS_PAGE_UNLOADED':
      for (const key of ['errors']) {
        delete state[key];
      }
      break;
  }

  return state;
};
