import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  signIn,
  signOut
} from './actions/UserActions'

import {
    View,
    Text, 
    Button
} from 'react-native'


class LoginView extends Component {
  render() {
    return (
      <View>
        <Button
          title="Login"
          onPress={this.props.signIn}
          disabled={!!this.props.user}
          />
        <Button
          title="Logout"
          onPress={this.props.signOut}
          disabled={!this.props.user}
          color="red"
          />
      </View>
    )
  }
}

export default connect(
  ({ UserReducer }) => ({
    user: UserReducer.user
  }),
  (dispatch) => ({
    signIn: () => dispatch(signIn()),
    signOut: () => dispatch(signOut())
  })
)(LoginView)