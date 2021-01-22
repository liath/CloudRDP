import _ from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import app from './App';
import './App.global.css';

import configureStore from './store';

const { store, persistor } = configureStore();

const mapStateToProps = (state) => _.pick(state.config, []);
const mapDispatchToProps = {};

const App = connect(mapStateToProps, mapDispatchToProps)(app);

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
