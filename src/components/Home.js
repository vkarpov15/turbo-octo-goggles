'use strict';

const ArticleList = require('./ArticleList');
const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const Promise = global.Promise;

const Tags = props => {
  const tags = props.tags;
  if (tags) {
    return (
      <div className="tag-list">
        {
          tags.map(tag => {
            return (
              <a href="" className="tag-default tag-pill" key={tag}>
                {tag}
              </a>
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div>Loading Tags...</div>
    );
  }
}

class Banner extends React.Component {
  render() {
    if (this.props.token) {
      return null;
    }
    return (
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">
            {this.props.appName.toLowerCase()}
          </h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
    );
  }
};

const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      store.dispatch({ type: 'UPDATE_FIELD', key: 'tab', value: 'feed' });
    }

    return (
      <li className="nav-item">
        <a  href=""
            className={ props.tab === 'feed' ? 'nav-link active' : 'nav-link' }
            onClick={clickHandler}>
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    store.dispatch({ type: 'UPDATE_FIELD', key: 'tab', value: 'all' });
  };
  return (
    <li className="nav-item">
      <a  href=""
          className={ props.tab === 'all' ? 'nav-link active' : 'nav-link' }
          onClick={clickHandler}>
        Global Feed
      </a>
    </li>
  );
}

const MainView = props => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">

          <YourFeedTab token={props.token} tab={props.tab} />

          <GlobalFeedTab tab={props.tab} />

        </ul>
      </div>

      <ArticleList articles={props.articles} loading={props.loading} />
    </div>
  );
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    this.unsubscribe =
      store.subscribe(() => { this.setState(store.getState()) });

    store.dispatch({
      type: 'HOME_PAGE_LOADED',
      payload: Promise.all([agent.Tags.getAll(), agent.Articles.feed()])
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'HOME_PAGE_UNLOADED' });
  }

  render() {
    return (
      <div className="home-page">

        <Banner token={this.state.token} appName={this.state.appName} />

        <div className="container page">
          <div className="row">
            <MainView
              token={this.state.token}
              tab={this.state.tab}
              articles={this.state.articles}
              loading={this.state.loading} />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags tags={this.state.tags} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = Home;
