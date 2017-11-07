import React, { Component } from 'react'

import {
  Text,
  View,
  FlatList
} from 'react-native'

import Styles from './Styles'

export default class DataView extends Component<{}> {
  renderItem({item}) {
    return <Text>Item: {item.name} {item.start}-{item.end}</Text>
  }

  render() {
    return (
      <View>
        <Text>
          Tasks:
        </Text>
        <FlatList 
          style={Styles.container}
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={item => item.name}
          />
      </View>
    )
  }
}