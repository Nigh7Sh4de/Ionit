import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react';
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import {
  AsyncStorage
} from 'react-native'

import App from './src/App.js'
import reducers from './src/reducers'
import createTransform from 'redux-persist/lib/createTransform';

const MassageEventData = createTransform(
  inbound => ({
    data: inbound.data
  }),
  outbound => ({
    data: outbound.data,
    filtered_data: outbound.data
  }), {
    whitelist: ['EventReducer']
  }
)

const persistConfig = {
  key: 'root',
  storage: storage,
  transforms: [MassageEventData],
  stateReconciler: autoMergeLevel2
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers, applyMiddleware(thunk))
const persistor = persistStore(store);

AppRegistry.registerComponent('Ionit', () => 
  class extends Component {
    render() {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      )
    }
  }
)
