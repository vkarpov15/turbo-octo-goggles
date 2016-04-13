'use strict';

const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const DeleteButton = props => {
  const del = () => {
    store.dispatch({
      type: 'DELETE_COMMENT',
      payload: agent.Comments.delete(props.slug, props.commentId),
      commentId: props.commentId
    });
  };

  if (props.show) {
    return (
      <span className="mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    );
  }
  return;
};

const Comment = props => {
  const comment = props.comment;
  const show = props.currentUser &&
    props.currentUser.username === comment.author.username;
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
        <DeleteButton show={show} slug={props.slug} commentId={comment.id} />
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
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              slug={props.slug}
              key={comment.id} />
          );
        })
      }
    </div>
  );
};

class CommentInput extends React.Component {
  constructor() {
    super();
    this.state = {
      body: ''
    };

    this.setBody = ev => {
      this.setState({ body: ev.target.value });
    };

    this.createComment = ev => {
      ev.preventDefault();
      const payload = agent.Comments.create(this.props.slug,
        { body: this.state.body });
      store.dispatch({ type: 'ADD_COMMENT', payload });
    };
  }

  render() {
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="3">
          </textarea>
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUser.image}
            className="comment-author-img" />
          <button
            className="btn btn-sm btn-primary"
            type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

const CommentContainer = props => {
  if (props.currentUser) {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
          <list-errors errors={props.errors}></list-errors>
          <CommentInput slug={props.slug} currentUser={props.currentUser} />
        </div>

        <CommentList
          comments={props.comments}
          slug={props.slug}
          currentUser={props.currentUser} />
      </div>
    );
  } else {
    return (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <p>
          <a ui-sref="app.login">Sign in</a> or <a ui-sref="app.register">sign up</a> to add comments on this article.
        </p>

        <CommentList
          comments={props.comments}
          slug={props.slug}
          currentUser={props.currentUser} />
      </div>
    );
  }
};

const ArticleActions = props => {
  const article = props.article;
  if (props.canModify) {
    return (
      <div>
        <span>

          <Router.Link
            to={`/editor/${article.slug}`}
            className="btn btn-outline-secondary btn-sm">
            <i className="ion-edit"></i> Edit Article
          </Router.Link>

          <button className="btn btn-outline-danger btn-sm">
            <i className="ion-trash-a"></i> Delete Article
          </button>

        </span>
      </div>
    );
  }

  return (
    <div>
      <span>
      </span>
    </div>
  );
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
              errors={this.state.commentErrors}
              slug={this.props.params.id}
              currentUser={this.state.currentUser} />
          </div>

        </div>



      </div>
    );
  }
}

module.exports = Article;
