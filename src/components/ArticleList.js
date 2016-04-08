'use strict';

const ArticlePreview = require('./ArticlePreview');
const React = require('react');

const ArticleList = props => {
  if (!props.articles) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  if (props.articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <div>
      {
        props.articles.map(article => {
          return (
            <ArticlePreview article={article} />
          );
        })
      }
    </div>
  );
};

module.exports = ArticleList;
