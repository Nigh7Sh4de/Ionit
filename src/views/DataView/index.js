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

class DataView extends Component {
  componentWillMount() {
    this.generateDataView(this.props)
  }

  componentWillUpdate(nextProps) {
      this.generateDataView(nextProps)
  }

  generateDataView(props) {
    if (props.loading) this._data_view = 
      <Text>Loading...</Text>
    else if (props.data.length === 0) this._data_view = 
      <Text>You currently have no events</Text>
    else if (props.filtered_data.length === 0) this._data_view = 
      <Text>No search results</Text>
    else this._data_view = <DataListView />
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
    filtered_data: EventReducer.filtered_data,
    loading: EventReducer.data_loading
  }),
  (dispatch) => ({
    createEvent: () => Screens.newEvent(),
    signOut: () => dispatch(signOut())

  })
)(DataView)