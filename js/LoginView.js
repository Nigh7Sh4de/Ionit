import React, { Component } from 'react'

import {
    View,
    Text, 
    Button
} from 'react-native'

import GoogleSignIn from 'react-native-google-sign-in';

export default class LoginView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }
  
  async logIn() {
    try {
      const user = await GoogleSignIn.signInPromise()
      this.props.setUser(user)
    }
    catch (e) {
      console.error(e)
    }
  }

  async logOut() {
    GoogleSignIn.signOutPromise()
    this.props.setUser(null)
  }
      
  render() {
    return (
      <View>
        <Button
          onPress={this.logIn.bind(this)}
          title="Login"
          disabled={this.props.logged_in}
          />
        <Button
          onPress={this.logOut.bind(this)}
          title="Logout"
          color="red"
          disabled={!this.props.logged_in}
          />
      </View>
    )
  }
}
