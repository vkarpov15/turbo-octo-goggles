const Redux = require('redux');
const middleware = require('./middleware');
const reducer = require('./reducer');

const store = Redux.createStore(reducer, Redux.applyMiddleware(middleware));

module.exports = store;
