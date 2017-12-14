import React, { Component, createElement } from 'react'
import {
  Platform,
  ScrollView,
  Text,
  View,
  Button
} from 'react-native'
import { connect } from 'react-redux'
import { Actions, Router, Scene, Stack } from 'react-native-router-flux'
import GoogleSignIn from 'react-native-google-sign-in';

import UserReducer from './reducers/UserReducer'
import {
  signInSilently,
} from './actions/UserActions'

import LoginView from './LoginView'
import DataView from './DataView'
import NewTaskView from './NewTaskView'

import Styles from './Styles'

const Scenes = Actions.create(
  <Stack key='root'>
    <Scene key='data' component={DataView} title='Data' />
    <Scene key='newTask' path='/task/new' component={NewTaskView} title='New Task' />
    <Scene key='editTask' path='/task/:id' component={NewTaskView} title='Edit Task' />
    <Scene key='newSubTask' path='/task/:id/sub' component={NewTaskView} title='New Sub Task' />
  </Stack>
)

class App extends Component {
  componentWillMount() {
    this.props.signInSilently()
  }

  render() {
    if (!!this.props.user)
      return (
        <Router scenes={Scenes} />
      )
    else return <LoginView />
  }
}

export default connect(
  ({ UserReducer })=>({
    user: UserReducer.user
  }),
  (dispatch) => ({
    signInSilently: () => dispatch(signInSilently()),
  })
)(App)