import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
  Text,
  View,
  Switch,
  TextInput
} from 'react-native'

import {
  updateFilter
} from 'src/actions/EventActions'


class FilterView extends PureComponent {
  updateFilter() {
    this.props.updateFilter(this.state)
  }

  updateMaster(master) {
    this.updateFilter({ master })
  }

  updateSearch(search) {
    this.updateFilter({ search })
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Search"
          onChangeText={this.updateSearch.bind(this)}
          value={this.props.filter.search}
          />
        <Text>Only master:</Text>
        <Switch
          onValueChange={this.updateMaster.bind(this)}
          value={this.props.filter.master}
          />
      </View>
    )
  }
}

export default connect(({ EventReducer }) => ({
  filter: EventReducer.filter
}), dispatch => ({
  updateFilter: filter => dispatch(updateFilter(filter))
}))(FilterView)