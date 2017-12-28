import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions as Screens } from 'react-native-router-flux'

import {
  View,
  Text
} from 'react-native'

class EventDetailView extends Component {
  componentWillMount() {
    const eventId = this.props.navigation.state.params.id

    this.setState(this.props.data.find(i => i.id === eventId ))
  }

  render() {
    return <View>
      <Text>{this.state.summary}</Text>
    </View>
  }
}

export default connect(({ EventReducer }) => ({
  data: EventReducer.data
}), (dispatch) => ({

}))(EventDetailView)