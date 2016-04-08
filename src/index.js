'use strict';

const ReactDOM = require('react-dom');
const React = require('react');
const Router = require('react-router');
const agent = require('./agent');
const history = require('history');
const store = require('./store');

const Header = require('./components/Header');
const Home = require('./components/Home');
const Login = require('./components/Login');
const Register = require('./components/Register');

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    store.dispatch({
      type: 'APP_LOAD',
      token: token,
      payload: token ? agent.Auth.current() : null
    });
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
      <Router.Route path="register" component={Register} />
    </Router.Route>
  </Router.Router>
), document.getElementById('main'));
