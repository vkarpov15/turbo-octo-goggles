'use strict';

const articleList = require('./reducers/articleList');
const auth = require('./reducers/auth');
const editor = require('./reducers/editor');
const home = require('./reducers/home');
const profile = require('./reducers/profile');
const settings = require('./reducers/settings');

const defaultState = {
  appName: 'Conduit2',
  token: null
};

module.exports = (state = defaultState, action) => {
  state = articleList(state, action);
  state = auth(state, action);
  state = editor(state, action);
  state = home(state, action);
  state = profile(state, action);
  state = settings(state, action);

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
  }

  return state;
};
