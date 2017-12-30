import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  View, Text, TouchableOpacity
} from 'react-native'
import Styles from '~/Styles';


class DataRowExpandedView extends PureComponent {
  componentWillMount() {
    const item = this.props.data.find(i => i.id === this.props.id)
    let parent, children = []
    this.props.data.forEach(i => {
      if (item.extendedProperties && item.extendedProperties.shared.parent === i.id)
        parent = i
      else if (i.parent === item.id)
        children.push(i)
    })
    this.setState({
      item,
      parent,
      children
    })
  }

  render() {
    return <View style={Styles.fixedRow}>
      <Text>Parent: {this.state.parent ? this.state.parent.summary : 'N/A'}</Text>
      <TouchableOpacity
        onPress={this.props.collapseEvent}>
        <Text>{this.state.item.summary}</Text>
      </TouchableOpacity>
      <Text>Children:</Text>
      {
        this.state.children.length === 0 ?
          <Text>None</Text> :
          this.state.children.map(c => <Text>{c.summary}</Text>)
      }
    </View>
  }
}


export default connect(({ EventReducer }) => ({
  data: EventReducer.data
}), dispatch => ({

}))(DataRowExpandedView)