'use strict';

const ReactDOM = require('react-dom');
const React = require('react');
const Router = require('react-router');
const Redux = require('redux');
const agent = require('./agent');
const history = require('history');
const middleware = require('./middleware');
const reducer = require('./reducer');

const store = Redux.createStore(reducer, Redux.applyMiddleware(middleware));

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <a className="navbar-brand">
            {this.props.state.appName}
          </a>

          <ul className="nav navbar-nav pull-xs-right">

            <li className="nav-item">
              <a className="nav-link">
                Home
              </a>
            </li>

            <li className="nav-item">
              <Router.Link to="login" className="nav-link">
                Sign in
              </Router.Link>
            </li>

            <li className="nav-item">
              <a className="nav-link">
                Sign up
              </a>
            </li>

          </ul>

        </div>
      </nav>
    );
  }
}

function renderTags(tags) {
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

                {renderTags(this.state.tags)}

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const ListErrors = errors => {
  if (errors) {
    return (
      <ul className="error-messages">
        {
          Object.keys(errors).map(key => {
            return (
              <li key={key}>
                {key} {errors[key]}
              </li>
            );
          })
        }
      </ul>
    )
  } else {
    return;
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
    this.changeEmail = ev => store.dispatch({
      type: 'UPDATE_FIELD',
      key: 'email',
      value: ev.target.value
    });
    this.changePassword = ev => store.dispatch({
      type: 'UPDATE_FIELD',
      key: 'password',
      value: ev.target.value
    });
    this.submitForm = ev => {
      ev.preventDefault();
      store.dispatch({
        type: 'LOGIN',
        payload: agent.Auth.login(this.state.email, this.state.password)
      });
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Router.Link to="register">
                  Need an account?
                </Router.Link>
              </p>

              {ListErrors(this.state.errors)}

              <form onSubmit={this.submitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button className="btn btn-lg btn-primary pull-xs-right"
                    type="submit">
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState());

      if (store.getState().redirectTo) {
        this.context.router.replace(store.getState().redirectTo);
        store.dispatch({ type: 'REDIRECT' });
      }
    });
  }

  render() {
    return (
      <div>
        <Header state={this.state} />
        {this.props.children}
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ReactDOM.render((
  <Router.Router history={Router.hashHistory}>
    <Router.Route path="/" component={App}>
      <Router.IndexRoute component={Home} />
      <Router.Route path="login" component={Login} />
    </Router.Route>
  </Router.Router>
), document.getElementById('main'));
