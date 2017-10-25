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
    this.state = {}
  }
  
  fetchData() {
    AsyncStorage.getItem('data')
    .then((data) => {
      console.log(data)
      this.setState({
        data
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  saveData() {
    AsynStorage.setItem('data', this.state.data.toString())
    .then((result) => {
      console.log('Saved', result)
    })
    .catch((error) => {
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
        <ActionsView />
      </View>
    )
  }
}
