import React, { Component } from 'react'
import {
  Platform,
  AsyncStorage,
  ScrollView,
  Text,
  View,
  Button
} from 'react-native'

import GoogleSignIn from 'react-native-google-sign-in';

import LoginView from './LoginView'
import DataView from './DataView'
import NewTaskInline from './NewTaskInline'

import Styles from './Styles'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      data: [],
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
    }, this.loadData)
  }

  async fetchData() {
    try {
      const items = await AsyncStorage.getItem('data')
      return items ? JSON.parse(items) : {}
    }
    catch(e) { console.error(e) }
  }

  async fetchGoogleData() {
    if (!this.state.user)
      return console.error('No user authenticated')
    const headers = {
      Authorization: 'Bearer ' + this.state.user.accessToken
    }
    
    let google_url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?'
    google_url += 'timeMin=' + new Date('2017/11/01').toISOString()
    try {
      const response = await fetch(google_url, { headers })
      return JSON.parse(response._bodyInit).items.filter(item => (
        item.status != 'cancelled'
      ))
    }
    catch(e) { console.error(e) }
  }

  async createGoogleEvent(task) {
    //TODO: normalize task
    try {
      const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        body: task
      })
      return result
    }
    catch(e) { console.error(e) }
  }

  async updateGoogleEvent(task) {
    //TODO: normalize task
    try {
      const result = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/' + task.id, {
        method: 'PUT',
        body: task
      })
      return result
    }
    catch(e) { console.error(e) }
  }

  async loadData() {
    const google_list = await this.fetchGoogleData()
    const local_list = await this.fetchData()
    const merged_list = google_list.map(gitem =>
      Object.assign(gitem, { ionit: local_list[gitem.id] })
    )

    this.setState({
      data: merged_list,
      local_data: local_list
    })
  }

  saveData() {
    AsyncStorage.setItem('local_data', JSON.stringify(this.state.local_data))
    .then((result) => {
      console.log('Saved', result)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  editTask(editTask) {
    this.setState({ editTask })
  }

  cancelEdit() {
    this.setState({ editTask: null })
  }

  createTask(task) {

    this.setState({
      data: [...this.state.data.filter(t => t.name != task.name), task],
      editTask: null
    }, this.saveData)
  }

  deleteTask(task) {
    this.setState({
      data: [...this.state.data.filter(t => t.name != task.name)],
      editTask: null
    }, this.saveData)
  }

  purgeTasks() {
    AsyncStorage.removeItem('data')
    .then(function(result) {
      console.log('Purged', result)
    })
    .then(this.fetchData.bind(this))
    .catch(function(error) {
      console.error(error)
    })
  }

  render() {
    return (
      <ScrollView>
        <LoginView
          setUser={this.setUser.bind(this)} />
        <NewTaskInline
          createTask={this.createTask.bind(this)}
          cancelEdit={this.cancelEdit.bind(this)}
          deleteTask={this.deleteTask.bind(this)} 
          task={this.state.editTask}
          data={this.state.data} 
          />
        <DataView 
          editTask={this.editTask.bind(this)}
          data={this.state.data}
          />
      </ScrollView>
    )
  }
}
