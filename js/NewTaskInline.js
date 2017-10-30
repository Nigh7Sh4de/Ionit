import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

export default class NewTaskInline extends Component<{}> {
  render() {
    return (
      <View>
        <TextInput 
            placeholder="New task"
            onChangeText={text=>this.setState({
                name: text
            })} />
        <Button 
            onPress={() => this.props.createTask(this.state)}
            title="Done" />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})