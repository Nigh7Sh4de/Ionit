import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Actions as Screens } from 'react-native-router-flux';

import {
  signOut
} from '~/actions/UserActions'

import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native'

import DataRowView from '~/views/DataView/DataRowView'
import DataRowExpandedView from '~/views/DataView/DataRowExpandedView'
import FilterView from '~/views/FilterView'
import Styles from '~/Styles'


class DataView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      expanded_event: props.navigation.state.params.id
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
    this.setState({
      expanded_event: id
    }, () => 
      this._list_ref.scrollToIndex({
        animated: true,
        index: this.props.data.findIndex(i=>i.id===id)
      })
    )
  }

  collapseEvent() {
    this.setState({
      expanded_event: null
    })
  }

  renderItem({item}) {
    if (this.state.expanded_event === item.id)
      return <DataRowExpandedView collapseEvent={this.collapseEvent.bind(this)} id={item.id} />
    else return <DataRowView expandEvent={this.expandEvent.bind(this)} id={item.id} />
  }

  render() {
    const now = new Date()
    const initial_scroll_index = this.props.navigation.state.params.id ?
      this.props.data.findIndex(i => i.id === this.props.navigation.state.params.id)
      :
      this.props.data.findIndex(i=>new Date(i.start.date || i.start.dateTime) > now)

    let data_view
    if (this.props.data.length === 0) {
      if (this.props.loading) data_view = <Text>Loading...</Text>
      else data_view = <Text>You currently have no events</Text>
    }
    else data_view = (
      <FlatList 
        ref={ref => this._list_ref = ref}
        style={Styles.container}
        data={this.props.data}
        renderItem={this.renderItem.bind(this)}
        initialScrollIndex={initial_scroll_index}
        getItemLayout={(data, index) => ({
          offset: index * 100,
          length: 100,
          index
        })}
        keyExtractor={item => item.id}
        />
    )

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
        {data_view}
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