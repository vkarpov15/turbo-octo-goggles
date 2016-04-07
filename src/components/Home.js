'use strict';

const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

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
      payload: agent.Tags.getAll()
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'HOME_PAGE_UNLOADED' });
  }

  render() {
    return (
      <div className="home-page">

        <div className="banner">
          <div className="container">
            <h1 className="logo-font">
              {this.state.appName}
            </h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">

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
