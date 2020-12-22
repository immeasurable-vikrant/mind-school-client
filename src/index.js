import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Routes, store } from './routes';
import { signIn } from './actions';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../styles/social.css';
import 'jquery';

const token = localStorage.getItem('token');
if (token) {
  store.dispatch(signIn());
}

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
