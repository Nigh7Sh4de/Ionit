import React, { Component } from 'react'
import GoogleSignIn from 'react-native-google-sign-in';

import {
    View,
    Text, 
    Button
} from 'react-native'



export default class LoginView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }
  
  componentWillMount() {
    GoogleSignIn.configure({
      clientID: '516748484660-l7rjdnvd8oafp38e0dut9r3l8ocgcser.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/calendar'
      ]
    });
  }

  async logIn() {
    this.setState({
      user = await GoogleSignIn.signInPromise()
    }) 
  }

  async logOut() {
    GoogleSignIn.signOutPromise()
    this.setState({
      user: null
    })
  }
      
  render() {
    return (
      <View>
        <Text>HELLO!</Text>
        <Button
          onPress={this.logIn.bind(this)}
          title="Login"
          />
        <Button
          onPress={this.logOut.bind(this)}
          title="Logout"
          color="red"
          />
        <Button
          onPress={this.getCalendars.bind(this)}
          title="Get Calendars"
          />
      </View>
    )
  }
}
