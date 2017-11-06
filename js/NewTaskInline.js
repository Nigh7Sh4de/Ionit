import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

import DatePicker from 'react-native-datepicker'

const defState = {
  name: '',
  date: '2017-11-06'
}

export default class NewTaskInline extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = defState
  }

  submit() {
    this.props.createTask(this.state)
    this.setState(defState)
  }

  render() {
    return (
      <View>
        <TextInput 
            placeholder="New task"
            onChangeText={text=>this.setState({ name: text })} 
            value={this.state.name} />
          <DatePicker
              mode="datetime"
              date={this.state.date}
              onDateChange={date=>this.setState({ date })}
              />
        <Button 
            onPress={this.submit.bind(this)}
            title="Done" />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})