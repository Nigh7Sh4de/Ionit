import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  Text,
  View,
  Button
} from 'react-native'
import { connect } from 'react-redux'
import GoogleSignIn from 'react-native-google-sign-in';

import { getAll } from './actions/EventActions'

import LoginView from './LoginView'
import DataView from './DataView'
import NewTaskInline from './NewTaskInline'

import Styles from './Styles'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      data: {},
      local_data: {},
      editTask: null,
      user: null
    }
  }
  
  async componentWillMount() {
    GoogleSignIn.configure({
      // clientID: '516748484660-l7rjdnvd8oafp38e0dut9r3l8ocgcser.apps.googleusercontent.com', //Laptop
      clientID: '516748484660-e1713ne24akk8pk8qd5nhpc1nc25ibl0.apps.googleusercontent.com', //Desktop
      scopes: [
        'https://www.googleapis.com/auth/calendar'
      ]
    });

    try {
      const user = await GoogleSignIn.signInSilentlyPromise()
      if (user) this.setUser(user)
    }
    catch(e) {
      if (e.code !== 4) console.error(e)
    }

  }

  setUser(user) {
    console.log(user)
    this.setState({
      user
    }, (() => {
      if (user) this.props.loadData(user)
    }).bind(this))
  }

  // async fetchGoogleData() {
  //   if (!this.state.user)
  //     return console.error('No user authenticated')
  //   const headers = {
  //     Authorization: 'Bearer ' + this.state.user.accessToken
  //   }
    
  //   let google_url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?'
  //   google_url += 'timeMin=' + new Date('2017/11/01').toISOString()
  //   try {
  //     const response = await fetch(google_url, { headers })
  //     const list = JSON.parse(response._bodyInit).items.filter(item => (
  //       item.status != 'cancelled'
  //     ))
  //     return list
  //   }
  //   catch(e) { console.error(e) }
  // }

  async createGoogleEvent(task) {
    try {
      const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.user.accessToken
        }
      })
      if (!result.ok) throw JSON.parse(result._bodyInit).error
      return result
    }
    catch(e) { console.error(e) }
  }

  async updateGoogleEvent(task) {
    try {
      const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/' + task.id, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.user.accessToken
        }
      })
      if (!result.ok) throw JSON.parse(result._bodyInit).error
      return result
    }
    catch(e) { console.error(e) }
  }
  
  async deleteGoogleEvent(task) {
    try {
      const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/' + task.id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + this.state.user.accessToken
        }
      })
      if (!result.ok) throw JSON.parse(result._bodyInit).error
      return result
    }
    catch(e) { console.error(e) }
  }

  // async loadData() {
  //   const google_data = await this.fetchGoogleData()

  //   this.setState({
  //     data: google_data
  //   })
  // }

  editTask(editTask) {
    this.setState({ editTask })
  }

  cancelEdit() {
    this.setState({ editTask: null })
  }

  async createTask(task) {
    let result;
    try {
      if (this.state.editTask && this.state.editTask.id == task.id) {
        result = await this.updateGoogleEvent(task)
      }
      else {
        result = await this.createGoogleEvent(task)
      }
      console.log(result)
    }
    catch(e) { console.error(e) }

    task.id = JSON.parse(result._bodyInit).id
    data = this.state.data
      .filter(i => i.id != task.id)
      .concat([task])

      this.setState({
      data,
      editTask: null
    })
  }

  async deleteTask(task) {
    try {
      const result = await this.deleteGoogleEvent(task)
      console.log(result)      
    }
    catch(e) { console.error(e) }

    const data = this.state.data
      .filter(i => i.id != JSON.parse(response._bodyInit).id)
    this.setState({
      data,
      editTask: null
    })
  }

  render() {
    return (
      <ScrollView>
        <LoginView
          setUser={this.setUser.bind(this)}
          logged_in={!!this.state.user} />
        <NewTaskInline
          createTask={this.createTask.bind(this)}
          cancelEdit={this.cancelEdit.bind(this)}
          deleteTask={this.deleteTask.bind(this)} 
          task={this.state.editTask}
          data={this.props.data} 
          />
        <DataView 
          editTask={this.editTask.bind(this)}
          data={this.props.data}
          />
      </ScrollView>
    )
  }
}

export default connect(
  ({ EventReducer }) => {
    console.log(EventReducer.data)
    return {
      data: EventReducer.data
    }
  },
  (dispatch) => ({
    loadData: (user) => dispatch(getAll(user))
  })
)(App)