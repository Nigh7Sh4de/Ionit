import React, { Component } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker
} from 'react-native'

import DatePicker from 'react-native-datepicker'

import Styles from './Styles'

const hour = 1000 * 60 * 60

generate_def_state = () => {
  const next = new Date(Math.ceil(Date.now() / hour ) * hour)
  const later = new Date(next.getTime() + hour)
  return {
    summary: '',
    start: {
      dateTime: next.toISOString()
    },
    end: {
      dateTime: later.toISOString()
    },
    extendedProperties: {
      shared: {
        parent: null
      }
    }
  }
}

export default class NewTaskInline extends Component {
  constructor(props) {
    super(props)
    this.state = generate_def_state()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.task && (
        !this.props.task ||
        newProps.task.id != this.props.task.id
    ))
      this.setState(newProps.task);
  }

  clearState(task) {
    const clear = Object.assign({}, this.state)
    for (var prop in clear) clear[prop] = undefined
    Object.assign(clear, task || generate_def_state())
    this.setState(clear)
  }

  addSubTask() {
    let newTask = generate_def_state()
    newTask.extendedProperties.shared.parent = this.state.id
    this.clearState(newTask)
  }

  submit() {
    this.props.createTask(this.state)
    this.clearState()
  }

  delete() {
    this.props.deleteTask(this.state)
    this.clearState()
  }

  cancel() {
    this.props.cancelEdit()
    this.clearState()
  }

  updateStart(start) {
    const date = new Date(start)
    this.setState({
      start: { dateTime: new Date(date).toISOString() }, 
      end: { dateTime: new Date(date.getTime() + hour).toISOString() }
    })
  }

  updateEnd(end) {
    this.setState({ end: { dateTime: new Date(end).toISOString() }})
  }

  updateParent(parent, itemIndex) {
    this.setState({ extendedProperties: { shared: { parent }}})
  }

  render() {

    let data = this.props.data

    let parent_picker = {
      data: [{
        label: 'No items to select as parent.',
        id: null
      }],
      enabled: false
    }

    if (data && data.length > 0) {
      parent_picker.enabled = true;
      parent_picker.data = [{
        label: 'Select Parent',
        id: null
      }].concat(data.filter(d => d.id != this.state.id));
    }

    parent_picker.items = parent_picker.data.map(item =>
      <Picker.Item
        key={item.id}
        label={item.label || item.summary}
        value={item.id} />
    )

    return (
      <View style={Styles.container}>
        <Text>Name: </Text>
        <TextInput 
          placeholder="New task"
          onChangeText={summary=>this.setState({ summary })} 
          value={this.state.summary} />
        <Text>Start: </Text>
        <DatePicker
          mode="datetime"
          date={new Date(this.state.start.dateTime)}
          onDateChange={this.updateStart.bind(this)}
          />
        <Text>End: </Text>
        <DatePicker
          mode="datetime"
          date={new Date(this.state.end.dateTime)}
          onDateChange={this.updateEnd.bind(this)}
          />
        <Picker 
          selectedValue={this.state.extendedProperties.shared.parent}
          onValueChange={this.updateParent.bind(this)}
          enabled={parent_picker.enabled}
          >{parent_picker.items}</Picker>
        <Button 
            onPress={this.submit.bind(this)}
            title="Done" />
        <Button 
            onPress={this.addSubTask.bind(this)}
            color="#2b5"
            disabled={!this.state.id}
            title="Add Sub-Task" />
        <Button 
            onPress={this.delete.bind(this)}
            color="red"
            disabled={!this.state.id}
            title="Delete" />
        <Button 
            onPress={this.cancel.bind(this)}
            color="#9a9a9a"
            title="Cancel" />
      </View>
    )
  }
}