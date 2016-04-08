'use strict';

const React = require('react');
const Router = require('react-router');
const store = require('../store');

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <a className="navbar-brand">
            {this.props.state.appName.toLowerCase()}
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
              <Router.Link to="register" className="nav-link">
                Sign up
              </Router.Link>
            </li>

          </ul>

        </div>
      </nav>
    );
  }
}

module.exports = Header;
