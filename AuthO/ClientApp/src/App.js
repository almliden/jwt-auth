import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './components/Login';

import './custom.css'

export default class App extends Component {
  static displayName = 'App name: ' + App.name;

  render () {
    return (
      <Layout>
        <Route path='/' component={Login} />
      </Layout>
    );
  }
}