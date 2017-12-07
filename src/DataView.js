import React, { Component } from 'react'
import { connect } from 'react-redux';

import {
  editEvent
} from './actions/EventActions'

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
          onPress={() => this.props.editEvent(item)}
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
    editEvent: (event) => dispatch(editEvent(event))
  })
)(DataView)