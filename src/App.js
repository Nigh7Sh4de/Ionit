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
import {
  signInSilently,
} from './actions/UserActions'

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
  
  componentWillMount() {
    this.props.signInSilently()
  }

  //TODO: move to NewTaskInline
  editTask(editTask) {
    this.setState({ editTask })
  }

  cancelEdit() {
    this.setState({ editTask: null })
  }

  createTask(task) {
      if (this.state.editTask && this.state.editTask.id == task.id) {
        this.props.updateEvent(this.props.user, task)
      }
      else {
        this.props.createEvent(this.props.user, task)
      }
  }

  deleteTask(task) {
    this.props.deleteTask(this.props.user, task)
  }
  //End TODO

  render() {
    return (
      <ScrollView>
        <LoginView />
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
  ({ EventReducer, UserReducer }) => {
    // console.log(EventReducer.data)
    return {
      user: UserReducer.user,
      data: EventReducer.data
    }
  },
  (dispatch) => ({
    signInSilently: () => dispatch(signInSilently()),
    loadData: (user) => dispatch(getAll(user)),
    createEvent: (user, event) => dispatch(createEvent(user, event)),
    updateEvent: (user, event) => dispatch(updateEvent(user, event)),
    deleteEvent: (user, event) => dispatch(deleteEvent(user, event))
  })
)(App)