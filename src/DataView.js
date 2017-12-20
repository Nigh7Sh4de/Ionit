import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import {
  editEvent,
  getAll
} from './actions/EventActions'
import {
  signOut
} from './actions/UserActions'

import {
  Text,
  View,
  Button,
  FlatList,
  VirtualizedList,
  RefreshControl
} from 'react-native'

import InfiniteList from './lib/InfiniteList'
import FilterView from './FilterView'

import Styles from './Styles'

class DataView extends Component {
  constructor(props) {
    super(props)
    const now = new Date()
    this.state = {
      loading: true
    }
    this.TIME_PERIOD = 1000*60*60*24*7
  }

  // componentWillMount() {
  //   this.setState({
  //     data: this.props.data
  //   })
  // }

  // componentDidMount() {
  //   setTimeout(() => this.scrollToNow.bind(this), 100)
  // }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data,
      loading: true
    })
  }

  scrollToNow() {
    const now = new Date()
    // return 
      this.infiniteListRef.scrollToItem(i => 
        new Date(i.start.date || i.start.dateTime) > now)
  }

  loadBefore() {
    const min = new Date(this.props.data_time_min.valueOf() - this.TIME_PERIOD)
    // const max = new Date(this.props.data_time_max)

    console.log('before', min, this.props.data_time_min)
    this.props.getData(min, this.props.data_time_min)
  }
  
  loadAfter() {
    // const min = new Date(this.props.data_time_min)
    const max = new Date(this.props.data_time_max.valueOf() + this.TIME_PERIOD)
    
    console.log('after', this.props.data_time_max, max)
    this.props.getData(this.props.data_time_max, max)
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

  render() {
    let data_view
    if (this.props.data.length === 0) {
      if (this.props.loading) data_view = <Text>Loading...</Text>
      else data_view = <Text>No events</Text>
    }
    else {
      data_view = <InfiniteList 
      ref={ref => this.infiniteListRef = ref}
      style={Styles.container}
      data={this.props.data}
      itemLength={100}
      renderItem={({ item }) => 
        <DataItem 
          id={item.id}
          summary={item.summary}
          start={item.start.date || item.start.dateTime}
          end={item.end.dateTime}
          editEvent={this.props.editEvent}
          />
      }
      onEndReachedThreshold={1}
      onTopReachedThreshold={1}
      thresholdTimeout={5000}
      onTopReached={this.loadBefore.bind(this)}
      onEndReached={this.loadAfter.bind(this)}
      keyExtractor={item => item.id}
      initialScrollIndex={this.props.data.findIndex(i => 
          new Date(i.start.date || i.start.dateTime) > new Date())}
      />
    }

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
          Tasks:
        </Text>
        <Button
          title='Scroll to Now'
          onPress={this.scrollToNow.bind(this)}
          />
        {data_view}
      </View>
    )
  }
}


class DataItem extends PureComponent {
  render() {
    return (
      <View style={Styles.fixedRow}>
        <Button
          onPress={() => this.props.editEvent.bind(this)(this.props.id)}
          title="Edit"
          />
        <Text>
          {this.props.summary} {this.props.start}-{this.props.end}
        </Text>
      </View>
    )
  }
}

export default connect(
  ({ EventReducer }) => ({
    data: EventReducer.data,
    data_time_min: EventReducer.data_time_min,
    data_time_max: EventReducer.data_time_max,
    loading: EventReducer.data_loading,
  }),
  (dispatch) => ({
    getData: (min, max) => dispatch(getAll(null, min, max)),
    editEvent: id => Actions.editTask({ id }),
    createEvent: Actions.newTask,
    signOut: () => dispatch(signOut()),
  })
)(DataView)