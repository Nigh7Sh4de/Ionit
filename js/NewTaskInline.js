import React, { Component } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native'

import DatePicker from 'react-native-datepicker'

import Styles from './Styles'

const hour = 1000 * 60 * 60

generate_def_state = () => {
  const next = new Date(Math.ceil(Date.now() / hour ) * hour)
  const later = new Date(next.getTime() + hour)
  return {
    name: '',
    start: next,
    end: later
  }
}

export default class NewTaskInline extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = generate_def_state()
  }

  submit() {
    this.props.createTask(this.state)
    this.setState(generate_def_state())
  }

  updateStart(start) {
    const date = new Date(start)
    this.setState({
      start: new Date(date),
      end: new Date(date.getTime() + hour)
    })
  }

  updateEnd(end) {
    this.setState({ end: new Date(end) })
  }

  render() {
    console.log('redraw')
    return (
      <View style={Styles.container}>
        <Text>Name: </Text>
        <TextInput 
          placeholder="New task"
          onChangeText={name=>this.setState({ name })} 
          value={this.state.name} />
        <Text>Start: </Text>
        <DatePicker
          mode="datetime"
          date={this.state.start}
          onDateChange={this.updateStart.bind(this)}
          />
        <Text>End: </Text>
        <DatePicker
            mode="datetime"
            date={this.state.end}
            onDateChange={this.updateEnd.bind(this)}
            />
        <Button 
            onPress={this.submit.bind(this)}
            title="Done" />
      </View>
    )
  }
}