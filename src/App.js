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

import LoginView from 'src/views/LoginView'
import DataView from 'src/views/DataView'
import EditEventView from 'src/views/EditEventView'

import Styles from './Styles'

const Scenes = Actions.create(
  <Stack key='root'>
    <Scene key='data' component={DataView} title='Data' />
    <Scene key='event' path='/event/:id' component={DataView} title='Data' />
    <Scene key='newEvent' path='/event/new' component={EditEventView} title='New Event' />
    <Scene key='editEvent' path='/event/:id/edit' component={EditEventView} title='Edit Event' />
    <Scene key='newChildEvent' path='/event/:id/newchild' component={EditEventView} title='New Child Event' />
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