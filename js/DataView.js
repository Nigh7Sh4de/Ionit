import React, { Component } from 'react'

import {
  Text,
  View,
  Button,
  FlatList
} from 'react-native'

import FilterView from './FilterView'

import Styles from './Styles'

export default class DataView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Object.values(props.data)
    }
  }

  componentWillMount() {
    this.setState({
      data: Object.values(this.props.data)
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: Object.values(newProps.data)
    })
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

  renderItem({item}) {
    return (
      <View>
        <Button
          onPress={() => this.props.editTask(item)}
          title="Edit"
          />
        <Text>
          Item: {item.summary} {item.start.dateTime}-{item.end.dateTime}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <FilterView
          updateFilter={this.updateFilter.bind(this)}
          />
        <Text>
          Tasks:
        </Text>
        <FlatList 
          style={Styles.container}
          data={this.state.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => item.id}
          />
      </View>
    )
  }
}