'use strict';

const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const Comment = props => {
  const comment = props.comment;
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <a className="comment-author">
          <img src={comment.author.image} className="comment-author-img" />
        </a>
        &nbsp;
        <a className="comment-author">
          {comment.author.username}
        </a>
        <span className="date-posted">
          {new Date(comment.createdAt).toDateString()}
        </span>
        <span className="mod-options">
          <i className="ion-trash-a"></i>
        </span>
      </div>
    </div>
  );
};

const CommentList = props => {
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
            <Comment comment={comment} />
          );
        })
      }
    </div>
  );
};

const CommentContainer = props => {
  if (props.currentUser) {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
          <list-errors errors={props.errors}></list-errors>
          <form className="card comment-form">
            <div className="card-block">
              <textarea className="form-control"
                placeholder="Write a comment..."
                rows="3">
              </textarea>
            </div>
            <div className="card-footer">
              <img src={props.currentUser.image} className="comment-author-img" />
              <button className="btn btn-sm btn-primary" type="submit">
               Post Comment
              </button>
            </div>
          </form>
        </div>

        <CommentList comments={props.comments} />
      </div>
    );
  } else {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <p>
          <a ui-sref="app.login">Sign in</a> or <a ui-sref="app.register">sign up</a> to add comments on this article.
        </p>

        <CommentList comments={props.comments} />
      </div>
    );
  }
};

class Article extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillMount() {
    store.dispatch({
      type: 'ARTICLE_PAGE_LOADED',
      payload: Promise.all([
        agent.Articles.get(this.props.params.id),
        agent.Comments.forArticle(this.props.params.id)
      ])
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'ARTICLE_PAGE_UNLOADED' });
  }

  render() {
    if (!this.state.article) {
      return null;
    }

    const markup = { __html: this.state.article.body };

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.state.article.title}</h1>

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              <div dangerouslySetInnerHTML={markup}></div>

              <ul className="tag-list">
                {
                  this.state.article.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="article-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.state.comments || []}
              currentUser={this.state.currentUser} />
          </div>

        </div>



      </div>
    );
  }
}

module.exports = Article;
