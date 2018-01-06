import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Actions as Screens } from 'react-native-router-flux';

import {
  signOut
} from 'src/actions/UserActions'

import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native'

import DataRowView from 'src/views/DataView/DataRowView'
import DataRowExpandedView from 'src/views/DataView/DataRowExpandedView'
import DataListView from 'src/views/DataView/DataListView'
import FilterView from 'src/views/FilterView'
import Styles from 'src/Styles'

getExpandedObject = (id, data) => {
  let expanded_id = id,
      expanded_index,
      expanded_length = 140

  if (id) 
    data.forEach((i, index) => {
      if (i.id === id)
        expanded_index = i
      else if (i.extendedProperties && 
          i.extendedProperties.shared &&
          i.extendedProperties.shared.parent === id)
        expanded_length += 40
    })

  return {
    expanded_id,
    expanded_index,
    expanded_length
  }
}

class DataView extends Component {

  componentWillUpdate(nextProps) {
    if (this.props.data.length === 0) {
      if (nextProps.loading) this._data_view = 
        <Text>Loading...</Text>
      else if (nextProps.data.length === 0) this._data_view = 
        <Text>You currently have no events</Text>
      else {
        const now = new Date()
        const initial_scroll_index = this.props.expanded_id || 
          nextProps.data.findIndex(i=>
            new Date(i.start.date || i.start.dateTime) > now
          )
        this._data_view = <DataListView 
          initialScrollIndex={initial_scroll_index}
          />
      }
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
          Events:
        </Text>
        {this._data_view}
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
    createEvent: () => Screens.newEvent(),
    signOut: () => dispatch(signOut())

  })
)(DataView)