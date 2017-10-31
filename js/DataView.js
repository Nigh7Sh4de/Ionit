import React, { Component } from 'react';

import {
  Text,
  View,
  FlatList
} from 'react-native';

export default class DataView extends Component<{}> {
  renderItem({item}) {
    return <Text>Item: {item.name}</Text>
  }

  render() {
    return (
      <View>
        <Text>
          Welcome to Ionit!
        </Text>
        <FlatList 
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={item => item.name}
          />
      </View>
    )
  }
}