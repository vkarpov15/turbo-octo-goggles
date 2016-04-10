'use strict';

const React = require('react');

const ArticlePreview = props => {
  const article = props.article;
  return (
    <div className="article-preview">
      <div className="article-meta">
        <a href="">
          <img src={article.author.image} />
        </a>

        <div className="info">
          <a  className="author"
              href="">
            {article.author.username}
          </a>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className="btn btn-sm">
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <a className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {
            article.tagList.map(tag => {
              return (
                <li className="tag-default tag-pill tag-outline" key={tag}>
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
