import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import App from './src/App.js'
import reducers from './src/reducers'

const store = createStore(reducers, applyMiddleware(thunk))

AppRegistry.registerComponent('Ionit', () => 
  class extends Component {
    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      )
    }
  }
)
