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
      <View style={Styles.fixedRow}>
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
    let data_view
    if (this.props.data.length === 0) {
      if (this.props.loading) data_view = <Text>Loading...</Text>
      else data_view = <Text>You currently have no events</Text>
    }
    else data_view = (
      <FlatList 
        style={Styles.container}
        data={this.props.data}
        renderItem={this.renderItem.bind(this)}
        initialScrollIndex={this.props.data.findIndex(i=>new Date(i.start.date || i.start.dateTime) > new Date())}
        getItemLayout={(data, index) => ({
          offset: index * 100,
          length: 100,
          index
        })}
        keyExtractor={item => item.id}
        />
    )

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
        {data_view}
      </View>
    )
  }
}

export default connect(
  ({ EventReducer }) => ({
    data: EventReducer.data,
    loading: EventReducer.data_loading
  }),
  (dispatch) => ({
    editEvent: id => Actions.editTask({ id }),
    createEvent: Actions.newTask,
    signOut: () => dispatch(signOut())

  })
)(DataView)