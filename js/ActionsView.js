import React, { Component } from 'react';

import {
  View,
  Text
} from 'react-native'

import NewTaskInline from './NewTaskInline'

export default class ActionsView extends Component<{}> {
  render() {
    return (
      <View>
        <NewTaskInline
          createTask={this.props.createTask} />
      </View>
    )
  }
}