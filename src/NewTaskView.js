import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import { Actions } from 'react-native-router-flux'

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
  deleteEvent
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

  componentWillMount() {
    const eventId = this.props.navigation.state.params.id
    const routeName = this.props.navigation.state.params.routeName
    if (eventId) {
      if (routeName == 'editTask')
        this.setState(this.props.data.find(i => i.id == eventId))
      else if (routeName == 'newSubTask')
        this.updateParent(eventId)
    }
  }

  addSubTask() {
    Actions.newSubTask({ id: this.state.id })
  }

  submit() {
    if (this.state.id)
      this.props.updateEvent(this.state)
    else
      this.props.createEvent(this.state)
    Actions.data()
  }

  delete() {
    this.props.deleteEvent(this.state)
    Actions.data()
  }

  cancel() {
    Actions.data()
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

  updateParent(parent) {
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
  }), dispatch => ({
    createEvent: (event) => dispatch(createEvent(event)),
    updateEvent: (event) => dispatch(updateEvent(event)),
    deleteEvent: (event) => dispatch(deleteEvent(event))
  })
)(NewTaskView)