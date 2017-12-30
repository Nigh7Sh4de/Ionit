import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Text, 
  TouchableOpacity
} from 'react-native'
import { Actions as Screens } from 'react-native-router-flux';

import Styles from '~/Styles';

class DataRowView extends PureComponent {
  componentWillMount() {
    const item = this.props.data.find(i => i.id === this.props.id)
    // let parent, children = []
    // this.props.data.forEach(i => {
    //   if (item.extendedProperties && item.extendedProperties.shared.parent === i.id)
    //     parent = i
    //   else if (i.parent === item.id)
    //     children.push(i)
    // })
    this.setState({
      item,
      // parent,
      // children
    })
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.expandEvent(this.state.item.id)}
        style={Styles.fixedRow}
        >
        <Text>{this.state.item.summary}</Text>
        <Text>{this.state.item.start.date || this.state.item.start.dateTime}</Text>
      </TouchableOpacity>
    )
  }
}

export default connect(({ EventReducer }) => ({
  data: EventReducer.data
}), dispatch => ({
  
}))(DataRowView)