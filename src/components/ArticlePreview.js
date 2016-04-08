'use strict';

const React = require('react');

const ArticlePreview = props => {
  return (
    <div className="article-preview">
      <a className="preview-link">
        <h1>{props.article.title}</h1>
        <p>{props.article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            article.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              )
            })
          }
        </ul>
      </a>
    </div>
  );
}

module.exports = ArticlePreview;
