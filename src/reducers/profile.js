'use strict';

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_PAGE_LOADED':
      state.profile = action.payload[0].profile;
      state.articles = action.payload[1].articles;
      state.articlesCount = action.payload[1].articlesCount;
      state.currentPage = 0;
      break;
    case 'PROFILE_PAGE_UNLOADED':
      delete state.profile;
      delete state.articles;
      delete state.articlesCount;
      delete state.currentPage;
      break;
  }

  return state;
};
