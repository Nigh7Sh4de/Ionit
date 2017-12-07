import React, { Component, createElement } from 'react'
import {
  Platform,
  ScrollView,
  Text,
  View,
  Button
} from 'react-native'
import { connect } from 'react-redux'
import GoogleSignIn from 'react-native-google-sign-in';

import {
  signInSilently,
} from './actions/UserActions'

import LoginView from './LoginView'
import DataView from './DataView'
import NewTaskView from './NewTaskView'

import Styles from './Styles'

class App extends Component {
  componentWillMount() {
    this.props.signInSilently()
  }

  render() {
    return (
      <ScrollView>
        <LoginView />
        <NewTaskView />
        <DataView />
      </ScrollView>
    )
  }
}

export default connect(
  ({ EventReducer, UserReducer }) => {
    return {
      data: EventReducer.data
    }
  },
  (dispatch) => ({
    signInSilently: () => dispatch(signInSilently()),
  })
)(App)