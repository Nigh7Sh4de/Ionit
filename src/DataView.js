import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  editEvent
} from './actions/EventActions'
import {
  signOut
} from './actions/UserActions'

import {
  Text,
  View,
  Button,
  FlatList
} from 'react-native'

import FilterView from './FilterView'

import Styles from './Styles'

class DataView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  componentWillMount() {
    this.setState({
      data: this.props.data
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    })
  }

  updateFilter(filter) {
    this.setState({
      data: this.props.data.filter(item => {
        if (filter.master &&
            !!item.ionit &&
            !!item.ionit.parent) return false;
        if (filter.ionit &&
            !item.ionit) return false;

        return true;
      })
    })
  }

  renderItem({item}) {
    return (
      <View>
        <Button
          onPress={() => this.props.editEvent(item.id)}
          title="Edit"
          />
        <Text>
          Item: {item.summary} {item.start.dateTime}-{item.end.dateTime}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <Button
          title='Sign Out'
          onPress={this.props.signOut}
          color='red'
          />
        <Button
          title='Create New Event'
          onPress={this.props.createEvent}
          color='green'
          />
        <FilterView
          updateFilter={this.updateFilter.bind(this)}
          />
        <Text>
          Tasks:
        </Text>
        <FlatList 
          style={Styles.container}
          data={this.state.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => item.id}
          />
      </View>
    )
  }
}

export default connect(
  ({ EventReducer }) => ({
    data: EventReducer.data
  }),
  (dispatch) => ({
    editEvent: id => Actions.editTask({ id }),
    createEvent: Actions.newTask,
    signOut: () => dispatch(signOut())

  })
)(DataView)