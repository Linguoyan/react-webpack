import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Router from './router';

const Root = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
