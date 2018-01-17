import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  FlatList
} from 'react-native'
import { Actions as Screens } from 'react-native-router-flux';

import DataRowView from 'src/views/DataView/DataRowView'
import DataRowExpandedView from 'src/views/DataView/DataRowExpandedView'

import Styles from 'src/Styles';

class DataListView extends PureComponent {
  componentWillMount() {
    const now = new Date()
    this._initial_scroll_index = Math.max(0, this.props.expanded_index || 
      this.props.data.findIndex(i=>
        new Date(i.start.date || i.start.dateTime) > now
      ))
  }

  componentWillReceiveProps(nextProps) {
    if (this._list_ref &&
        nextProps.expanded_id !== this.props.expanded_id) {
      
      let index
      
      if (nextProps.expanded_index !== undefined)
        index = nextProps.expanded_index
      else if (this.props.expanded_index !== undefined)
        index = this.props.expanded_index
      
      if (index >= 0)
        this._list_ref.scrollToIndex({
          animated: true,
          index
        })
    } 
  }

  getItemLayout(data, index) {
    if (this.props.expanded_index && index === this.props.expanded_index)
      return {
        offset: index * 100,
        length: this.props.expanded_length,
        index
      }
    else if (this.props.expanded_index && index > this.props.expanded_index)
      return {
        offset: (index - 1) * 100 + this.props.expanded_length,
        length: 100,
        index
      }
    else return {
      offset: index * 100,
      length: 100,
      index
    }
  }

  renderItem({item, index}) {
    if (this.props.expanded_id === item.id)
      return <DataRowExpandedView 
        id={item.id} 
        />
        
    else 
      return <DataRowView 
      id={item.id} 
      />
  }

  render() {
    return <FlatList 
      ref={ref => this._list_ref = ref}
      style={Styles.container}
      data={this.props.data}
      renderItem={this.renderItem.bind(this)}
      initialScrollIndex={this._initial_scroll_index}
      getItemLayout={this.getItemLayout.bind(this)}
      keyExtractor={item => item.id}
    />
  }
}

export default connect(({ EventReducer }) => ({
  data: EventReducer.filtered_data || EventReducer.data,
  expanded_id: EventReducer.expanded_id,
  expanded_index: EventReducer.expanded_index,
  expanded_length: EventReducer.expanded_length
}), dispatch => ({

}))(DataListView)