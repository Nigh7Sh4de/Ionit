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
import FilterView from 'src/views/FilterView'
import Styles from 'src/Styles'

getExpandedObject = (id, data) => {
  let expanded_id = id,
      expanded_index,
      expanded_length = 140

  if (id) 
    data.forEach((i, index) => {
      if (i.id === id)
        expanded_index = i
      else if (i.extendedProperties && 
          i.extendedProperties.shared &&
          i.extendedProperties.shared.parent === id)
        expanded_length += 40
    })

  return {
    expanded_id,
    expanded_index,
    expanded_length
  }
}

class DataView extends Component {
  constructor(props) {
    super(props)
    const expanded = getExpandedObject(props.navigation.state.params.id, props.data)
    
    this.state = {
      data: props.data,
      ...expanded
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.data.length === 0) {
      if (nextProps.loading) this._data_view = 
        <Text>Loading...</Text>
      else if (nextProps.data.length === 0) this._data_view = 
        <Text>You currently have no events</Text>
      else {
        const now = new Date()
        const initial_scroll_index = this.state.expanded_id || 
          nextProps.data.findIndex(i=>
            new Date(i.start.date || i.start.dateTime) > now
          )
        this._data_view = <FlatList 
          ref={ref => this._list_ref = ref}
          style={Styles.container}
          data={nextProps.data}
          renderItem={this.renderItem.bind(this)}
          initialScrollIndex={initial_scroll_index}
          getItemLayout={this.getItemLayout.bind(this)}
          keyExtractor={item => item.id}
        />
      }
    }
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
  
  expandEvent(id) {
    this.setState(getExpandedObject(id, this.props.data), () => 
      this._list_ref.scrollToIndex({
        animated: true,
        index: this.props.data.findIndex(i=>i.id===id)
      })
    )
  }

  collapseEvent(id) {
    this.setState({
      expanded_id: null,
      expanded_index: undefined,
      expanded_length: undefined
    }, () => 
      this._list_ref.scrollToIndex({
        animated: true,
        index: this.props.data.findIndex(i=>i.id===id)
      })
    )
  }

  renderItem({item, index}) {
    if (this.state.expanded_id === item.id)
      return <DataRowExpandedView 
        collapseEvent={this.collapseEvent.bind(this)} 
        expandEvent={this.expandEvent.bind(this)} 
        id={item.id} 
        />
        
    else return <DataRowView 
      expandEvent={this.expandEvent.bind(this)} 
      id={item.id} 
      />
  }

  getItemLayout(data, index) {
    if (this.state.expanded_index && index === this.state.expanded_index)
      return {
        offset: index * 100,
        length: this.state.expanded_length,
        index
      }
    else if (this.state.expanded_index && index > this.state.expanded_index)
      return {
        offset: (index - 1) * 100 + this.state.expanded_length,
        length: 100,
        index
      }
    else return {
      offset: index * 100,
      length: 100,
      index
    }
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
    loading: EventReducer.data_loading
  }),
  (dispatch) => ({
    createEvent: () => Screens.newEvent(),
    signOut: () => dispatch(signOut())

  })
)(DataView)