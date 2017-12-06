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
  getAll,
  createEvent,
  updateEvent,
  deleteEvent
} from './actions/EventActions'

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

  editTask(editTask) {
    this.setState({ editTask })
  }

  cancelEdit() {
    this.setState({ editTask: null })
  }

  createTask(task) {
      if (this.state.editTask && this.state.editTask.id == task.id) {
        this.props.updateEvent(this.state.user, task)
      }
      else {
        this.props.createEvent(this.state.user, task)
      }
  }

  deleteTask(task) {
    this.props.deleteTask(this.state.user, task)
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
    // console.log(EventReducer.data)
    return {
      data: EventReducer.data
    }
  },
  (dispatch) => ({
    loadData: (user) => dispatch(getAll(user)),
    createEvent: (user, event) => dispatch(createEvent(user, event)),
    updateEvent: (user, event) => dispatch(updateEvent(user, event)),
    deleteEvent: (user, event) => dispatch(deleteEvent(user, event))
  })
)(App)