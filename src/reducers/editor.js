'use strict';

module.exports = (state, action) => {
  switch (action.type) {
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
        'articleSlug',
        'inProgress'
      ];
      for (const key of keys) {
        delete state[key];
      }
      break;
    case 'ARTICLE_SUBMITTED':
      state.inProgress = null;
      if (action.error) {
        state.errors = action.payload.errors;
      } else {
        state.redirectTo = `article/${action.payload.article.slug}`;
      }
      break;
    case 'ASYNC_START':
      if (action.subtype === 'ARTICLE_SUBMITTED') {
        state.inProgress = true;
      }
      break;
  }

  return state;
};
