import React, { Component } from 'react';

import {
  View,
  Text,
  Button
} from 'react-native'

import NewTaskInline from './NewTaskInline'

export default class ActionsView extends Component<{}> {
  render() {
    return (
      <View>
        <NewTaskInline
          createTask={this.props.createTask} />
        <Button
          onPress={this.props.purgeTasks}
          color="#ee2222"
          title="Purge Tasks" />
      </View>
    )
  }
}