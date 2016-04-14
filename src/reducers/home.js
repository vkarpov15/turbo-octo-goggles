'use strict';

module.exports = (state, action) => {
  switch (action.type) {
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
    case 'CHANGE_TAB':
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.tab = action.tab;
      state.currentPage = 0;
      break;
  }

  return state;
};
