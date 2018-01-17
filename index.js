import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore, persistReducer } from 'redux-persist';

import App from './src/App.js'
import reducers from './src/reducers'

const store = createStore(reducers, applyMiddleware(thunk))
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
