import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker
} from 'react-native'

import {
  createEvent,
  updateEvent,
  deleteEvent,
  actionCancelled
} from './actions/EventActions'

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

class NewTaskView extends Component {
  constructor(props) {
    super(props)
    this.state = generate_def_state()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.event && (
        !this.props.event ||
        newProps.event.id != this.props.event.id
    ))
      this.setState(newProps.event);
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
    if (this.props.event && this.props.event.id == this.state.id)
      this.props.updateEvent()
    else
      this.props.createEvent(this.state)
    this.clearState()
  }

  delete() {
    this.props.deleteEvent(this.state)
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

    let data = this.props.data.filter(item => !!item.summary)

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
          title="Done"
          onPress={this.submit.bind(this)}
          disabled={!this.state.summary}
          />
        <Button 
          title="Add Sub-Task"
          onPress={this.addSubTask.bind(this)}
          color="#2b5"
          disabled={!this.state.id} />
        <Button 
          title="Delete"
          onPress={this.delete.bind(this)}
          color="red"
          disabled={!this.state.id} />
        <Button 
          title="Cancel"
          onPress={this.cancel.bind(this)}
          color="#9a9a9a" />
      </View>
    )
  }
}

export default connect(
  ({ EventReducer }) => ({
    data: EventReducer.data,
    event: EventReducer.event
  }), dispatch => ({
    createEvent: (event) => dispatch(createEvent(event)),
    updateEvent: (event) => dispatch(updateEvent(user)),
    deleteEvent: (event) => dispatch(deleteEvent(event)),
    cancelEdit: (event) => dispatch(actionCancelled(event))
  })
)(NewTaskView)