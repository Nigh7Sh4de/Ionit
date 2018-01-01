import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  View, 
  Text, 
  TouchableOpacity,
  Button
} from 'react-native'
import Styles from 'src/Styles';
import { Actions as Screens } from 'react-native-router-flux';


class DataRowExpandedView extends PureComponent {
  render() {
    return <View>
      <TouchableOpacity 
        style={Styles.expandedRowParent}
        onPress={()=>this.props.parent && this.props.expandEvent(this.props.parent.id)}
        >
        <Text>Parent: {this.props.parent ? this.props.parent.summary : 'N/A'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Styles.expandedRowDetail}
        onPress={()=>this.props.collapseEvent(this.props.item.id)}>
        <Text>{this.props.item.summary}</Text>
        <Text>{this.props.item.start.date || this.props.item.start.dateTime}</Text>
        <Text>{this.props.item.end.date || this.props.item.end.dateTime}</Text>
        <Button 
          title="Edit"
          onPress={()=>this.props.editEvent(this.props.item.id)}
          />
      </TouchableOpacity>
      {
        this.props.children.length === 0 ?
          <Text style={Styles.expandedRowChild}>None</Text> :
          this.props.children.map(c => 
            <TouchableOpacity 
              key={c.id}
              style={Styles.expandedRowChild}
              onPress={()=>this.props.expandEvent(c.id)}
              >
              <Text>{c.summary}</Text>
            </TouchableOpacity>
          )
      }
    </View>
  }
}


export default connect(({ EventReducer }, { id }) => {
  const item = EventReducer.data.find(i => i.id === id)
  let parent, children = []
  EventReducer.data.forEach(i => {
    if (item.extendedProperties && item.extendedProperties.shared.parent === i.id)
      parent = i
    else if (i.extendedProperties && i.extendedProperties.shared.parent === id)
      children.push(i)
  })
  return {
    item,
    parent,
    children
  }
}, dispatch => ({
  editEvent: id => Screens.editEvent({ id })
}))(DataRowExpandedView)