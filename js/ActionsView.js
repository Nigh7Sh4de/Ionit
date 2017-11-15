import React, { Component } from 'react';

import {
  View,
  Text,
  Button
} from 'react-native'

import NewTaskInline from './NewTaskInline'

export default class ActionsView extends Component {
  render() {
    return (
      <View>
        <Text>New Task:</Text>
        <NewTaskInline
          createTask={this.props.createTask}
          deleteTask={this.props.deleteTask} 
          cancelEdit={this.props.cancelEdit}
          task={this.props.edit_task}
          data={this.props.data} 
          />
        <Button
          onPress={this.props.purgeTasks}
          color="#ee2222"
          title="Purge Tasks" />
      </View>
    )
  }
}