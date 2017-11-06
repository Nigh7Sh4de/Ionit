/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  AsyncStorage,
  Text,
  View
} from 'react-native'

import FilterView from './FilterView'
import DataView from './DataView'
import ActionsView from './ActionsView'

import Styles from './Styles'

export default class App extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = { data: [] }
  }

  fetchData() {
    AsyncStorage.getItem('data')
    .then((data) => {
      console.log('Fetched', data)
      this.setState({
        data: data ? JSON.parse(data) : []
      })
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

  createTask(task) {
    this.setState({
      data: [...this.state.data, task]
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
      <View>
        <FilterView style={Styles} />
        <DataView data={this.state.data} />
        <ActionsView 
          createTask={this.createTask.bind(this)} 
          purgeTasks={this.purgeTasks.bind(this)}
          />
      </View>
    )
  }
}
