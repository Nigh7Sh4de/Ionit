import React, { Component } from 'react'

import {
  Text,
  View,
  Button,
  FlatList
} from 'react-native'

import Styles from './Styles'

export default class DataView extends Component {
  renderItem({item}) {
    return (
      <View>
        <Button
          onPress={() => this.props.editTask(item)}
          title="Edit"
          />
        <Text>
          Item: {item.name} {item.start}-{item.end}
        </Text>
      </View>
    )
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
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => item.name}
          />
      </View>
    )
  }
}