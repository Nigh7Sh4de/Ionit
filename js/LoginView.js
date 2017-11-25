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
  
  async componentWillMount() {
    try {
      console.log('attempt fetch')
      const auth_info = await fetch('http://localhost:3000/auth')
      GoogleSignIn.configure({
        // clientID: '516748484660-l7rjdnvd8oafp38e0dut9r3l8ocgcser.apps.googleusercontent.com', //Laptop
        clientID: '516748484660-e1713ne24akk8pk8qd5nhpc1nc25ibl0.apps.googleusercontent.com', //Desktop
        // clientID: auth_info.json().auth_request.client_id,
        scopes: auth_info.json().auth_request.scope,
        serverClientID: auth_info.json().auth_request.client_id,
        offlineAccess: true
        // [ 'https://www.googleapis.com/auth/calendar' ]
      });
    }
    catch(e) { console.error(e) }
  }

  async logIn() {
    try {
      const user = await GoogleSignIn.signInPromise()
      console.log(user)
      this.setState({ user }) 
    }
    catch (e) {
      console.error(e)
    }
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
        {/* <Button
          onPress={this.getCalendars.bind(this)}
          title="Get Calendars"
          /> */}
      </View>
    )
  }
}
