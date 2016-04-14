'use strict';

module.exports = (state, action) => {
  switch (action.type) {
    case 'ARTICLE_FAVORITED':
    case 'ARTICLE_UNFAVORITED':
      state.articles.forEach(article => {
        if (article.slug === action.payload.article.slug) {
          article.favorited = action.payload.article.favorited;
          article.favoritesCount = action.payload.article.favoritesCount;
        }
      });
      break;
    case 'SET_PAGE':
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.currentPage = action.page;
      break;
  }

  return state;
};
