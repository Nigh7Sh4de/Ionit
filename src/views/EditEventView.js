import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import { Actions as Screens } from 'react-native-router-flux'

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  Switch
} from 'react-native'

import {
  createEvent,
  updateEvent,
  deleteEvent
} from '~/actions/EventActions'

import Styles from '~/Styles'

const hour = 1000 * 60 * 60

round_now_to_hour = () => {
  return new Date(Math.ceil(Date.now() / hour ) * hour)
}

generate_def_state = () => {
  const next = round_now_to_hour()
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

parseDate = (o) => {
  if (typeof o === 'string') {
    if (o.length < 11) return new Date(o + ' ')
    else return new Date(o)
   }

  const result = new Date(o.date ? o.date + ' ' : o.dateTime)
  if (isNaN(result.getTime())) return null
  else return result
}

toISODateString = (date) => {
  const d = new Date(date)
  d.setHours(0)
  return d.toISOString().substr(0, 10)
}

class EditEventView extends Component {
  constructor(props) {
    super(props)
    this.state = generate_def_state()
  }

  componentWillMount() {
    const eventId = this.props.navigation.state.params.id
    const routeName = this.props.navigation.state.params.routeName
    if (eventId) {
      if (routeName == 'editEvent')
       this.setState(this.props.data.find(i => i.id == eventId))
      else if (routeName == 'newChildEvent')
        this.updateParent(eventId)
    }
  }

  addChildEvent() {
    Screens.newChildEvent({ id: this.state.id })
  }

  submit() {
    switch(this.props.navigation.state.params.routeName) {
      case 'editEvent':
        this.props.updateEvent(this.state)
        break;
      case 'newChildEvent':
      case 'newEvent':
        this.props.createEvent(this.state)
        break;
    }
    
    Screens.data()
  }

  delete() {
    this.props.deleteEvent(this.state)
    Screens.data()
  }

  cancel() {
    Screens.data()
  }

  updateAllDay(all_day) {
    let now
    if (all_day) now = new Date(this._start_date_time = this.state.start.dateTime)
    else now = new Date(this._start_date_time)

    const later = new Date(now.valueOf() + 1000*60*60)
    this.setState({
      start: {
        dateTime: all_day ? undefined : now.toISOString(),
        date: all_day ? toISODateString(now) : undefined
      },
      end: {
        dateTime: all_day ? undefined : later.toISOString(),
        date: all_day ? toISODateString(now) : undefined
      }
    })
  }

  updateStart(start) {
    const all_day = !!this.state.start.date
    const delta = parseDate(this.state.end) - parseDate(this.state.start)
    const d_start = parseDate(start)
    const d_end = new Date(d_start.valueOf() + delta)

    this.setState({
      start: { 
        dateTime: all_day ? undefined : d_start.toISOString(),
        date: all_day ? toISODateString(d_start) : undefined
      }, 
      end: {
        dateTime: all_day ? undefined : d_end.toISOString(),
        date: all_day ? toISODateString(d_end) : undefined
      }
    })
  }

  updateEnd(end) {
    const all_day = !!this.state.end.date
    this.setState({ 
      end: { 
        dateTime: all_day ? undefined : end.toISOString(),
        date: all_day ? end.toISOString().substr(0, 10) : undefined
      }
    })
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
          placeholder="Event Name"
          onChangeText={summary=>this.setState({ summary })} 
          value={this.state.summary} />
        <Text>All Day:</Text>
        <Switch
          onValueChange={this.updateAllDay.bind(this)}
          value={!!this.state.start.date}
          />
        <Text>Start: </Text>
        <DatePicker
          mode={!!this.state.start.date ? "date" : "datetime"}
          date={parseDate(this.state.start)}
          onDateChange={this.updateStart.bind(this)}
          />
        <Text>End: </Text>
        <DatePicker
          mode={!!this.state.end.date ? "date" : "datetime"}
          date={parseDate(this.state.end)}
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
          title="Add Child Event"
          onPress={this.addChildEvent.bind(this)}
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
)(EditEventView)