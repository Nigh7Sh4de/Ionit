/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  AsyncStorage,
  ScrollView,
  Text,
  View
} from 'react-native'

import LoginView from './LoginView'
import DataView from './DataView'
import ActionsView from './ActionsView'

import Styles from './Styles'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      data: [],
      editTask: null
    }
  }

  fetchData() {
    AsyncStorage.getItem('data')
    .then((data) => {
      this.setState({
        data: data ? JSON.parse(data) : []
      }, () => console.log('Fetched', this.state.data))
    })
    .catch((error) => {
      console.error(error)
    })
  }

  saveData() {
    AsyncStorage.setItem('data', JSON.stringify(this.state.data))
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

  componentWillMount() {
      this.fetchData()
  }

  render() {
    return (
      <ScrollView>
        <LoginView />
        <DataView 
          editTask={this.editTask.bind(this)}
          data={this.state.data}
          />
        <ActionsView
          createTask={this.createTask.bind(this)} 
          purgeTasks={this.purgeTasks.bind(this)}
          cancelEdit={this.cancelEdit.bind(this)}
          deleteTask={this.deleteTask.bind(this)}
          edit_task={this.state.editTask}
          data={this.state.data}
          />
      </ScrollView>
    )
  }
}
