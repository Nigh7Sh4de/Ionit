import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Text, 
  TouchableOpacity
} from 'react-native'
import { Actions as Screens } from 'react-native-router-flux';

import Styles from 'src/Styles';

class DataRowView extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.expandEvent(this.props.item.id)}
        style={Styles.dataRow}
        >
        <Text>{this.props.item.summary}</Text>
        <Text>{this.props.item.start.date || this.props.item.start.dateTime}</Text>
      </TouchableOpacity>
    )
  }
}

export default connect(({ EventReducer }, { id }) => ({
  item: EventReducer.data.find(i=>i.id===id)
}), dispatch => ({
  
}))(DataRowView)