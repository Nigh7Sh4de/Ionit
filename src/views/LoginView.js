import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  signIn,
  signOut
} from 'src/actions/UserActions'

import {
    View,
    Text, 
    Button
} from 'react-native'


class LoginView extends Component {
  render() {
    let status = "Please click sign in to authenticate with Google"
    if (this.props.loading) status = "Loading..."
    if (this.props.error) status = this.props.error

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
        <Text>{status}</Text>
      </View>
    )
  }
}

export default connect(
  ({ UserReducer }) => ({
    user: UserReducer.user,
    error: UserReducer.error,
    loading: UserReducer.loading
  }),
  (dispatch) => ({
    signIn: () => dispatch(signIn()),
    signOut: () => dispatch(signOut())
  })
)(LoginView)