import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

export default class NewTaskInline extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = { name: '' }
  }

  submit() {
    this.props.createTask(this.state)
    this.setState({
      name: ''
    })
  }

  render() {
    return (
      <View>
        <TextInput 
            placeholder="New task"
            onChangeText={text=>this.setState({
                name: text
              })} 
            value={this.state.name} />
        <Button 
            onPress={this.submit.bind(this)}
            title="Done" />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})