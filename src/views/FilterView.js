import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import {
  Text,
  View,
  Switch
} from 'react-native'

import {
  updateFilter
} from 'src/actions/EventActions'


class FilterView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      master: false
    }
  }

  updateFilter() {
    this.props.updateFilter(this.state)
  }

  updateMaster(master) {
    this.setState({ master }, this.updateFilter)
  }

  render() {
    return (
      <View>
        <Text>Only master:</Text>
        <Switch
          onValueChange={this.updateMaster.bind(this)}
          value={this.state.master}
          />
      </View>
    )
  }
}

export default connect(({ EventReducer }) => ({
  
}), dispatch => ({
  updateFilter: filter => dispatch(updateFilter(filter))
}))(FilterView)