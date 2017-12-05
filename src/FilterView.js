import React, { Component } from 'react';

import {
  Text,
  View,
  Switch
} from 'react-native';


export default class FilterView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      master: false,
      ionit: false
    }
  }

  updateFilter() {
    this.props.updateFilter(this.state)
  }

  updateMaster(master) {
    this.setState({ master }, this.updateFilter)
  }

  updateIonit(ionit) {
    this.setState({ ionit }, this.updateFilter)
  }

  render() {
    return (
      <View>
        <Text>Only master:</Text>
        <Switch
          onValueChange={this.updateMaster.bind(this)}
          value={this.state.master}
          />
        <Text>Only ionit:</Text>
        <Switch
          onValueChange={this.updateIonit.bind(this)}
          value={this.state.ionit}
          />
      </View>
    )
  }
}
