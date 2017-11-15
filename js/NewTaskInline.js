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
    name: '',
    start: next.toString(),
    end: later.toString(),
    parent: null
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
        newProps.task.name != this.props.task.name
    ))
      this.setState(newProps.task);
  }

  addSubTask() {
    let newTask = generate_def_state()
    newTask.parent = this.state.name
    this.setState(newTask)
  }

  submit() {
    this.props.createTask(this.state)
    this.setState(generate_def_state())
  }

  cancel() {
    this.props.cancelEdit()
    this.setState(generate_def_state())
  }

  updateStart(start) {
    const date = new Date(start)
    this.setState({
      start: new Date(date).toString(),
      end: new Date(date.getTime() + hour).toString()
    })
  }

  updateEnd(end) {
    this.setState({ end: new Date(end).toString() })
  }

  updateParent(parent, itemIndex) {
    this.setState({ parent })
  }

  render() {

    let parent_picker = {
      data: [{
        label: 'No items to select as parent.',
        name: null
      }],
      enabled: false
    }

    if (this.props.data && this.props.data.length > 0) {
      parent_picker.enabled = true;
      parent_picker.data = [{
        label: 'Select Parent',
        name: null
      }].concat(this.props.data);
    }

    parent_picker.items = parent_picker.data.map(item =>
      <Picker.Item
        key={item.name}
        label={item.label || item.name}
        value={item.name} />
    )

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
          date={new Date(this.state.start)}
          onDateChange={this.updateStart.bind(this)}
          />
        <Text>End: </Text>
        <DatePicker
          mode="datetime"
          date={new Date(this.state.end)}
          onDateChange={this.updateEnd.bind(this)}
          />
        <Picker 
          selectedValue={this.state.parent}
          onValueChange={this.updateParent.bind(this)}
          enabled={parent_picker.enabled}
          >{parent_picker.items}</Picker>
        <Button 
            onPress={this.submit.bind(this)}
            title="Done" />
        <Button 
            onPress={this.addSubTask.bind(this)}
            color="#2b5"
            disabled={!this.state.name}
            title="Add Sub-Task" />
        <Button 
            onPress={this.cancel.bind(this)}
            color="#9a9a9a"
            title="Cancel" />
      </View>
    )
  }
}