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
      dateTime: next.toString()
    },
    end: {
      dateTime: later.toString()
    },
    ionit: {
      parent: null
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

  addSubTask() {
    let newTask = generate_def_state()
    newTask.ionit.parent = this.state.id
    this.setState(newTask)
  }

  submit() {
    this.props.createTask(this.state)
    this.setState(generate_def_state())
  }

  delete() {
    this.props.deleteTask(this.state)
    this.setState(generate_def_state())
  }

  cancel() {
    this.props.cancelEdit()
    this.setState(generate_def_state())
  }

  updateStart(start) {
    const date = new Date(start)
    this.setState({
      start: { dateTime: new Date(date).toString() }, 
      end: { dateTime: new Date(date.getTime() + hour).toString() }
    })
  }

  updateEnd(end) {
    this.setState({ end: { dateTime: new Date(end).toString() }})
  }

  updateParent(parent, itemIndex) {
    this.setState({ ionit: { parent }})
  }

  render() {

    let parent_picker = {
      data: [{
        label: 'No items to select as parent.',
        id: null
      }],
      enabled: false
    }

    if (this.props.data && this.props.data.length > 0) {
      parent_picker.enabled = true;
      parent_picker.data = [{
        label: 'Select Parent',
        id: null
      }].concat(this.props.data);
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
          selectedValue={this.state.ionit ? this.state.ionit.parent : false}
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