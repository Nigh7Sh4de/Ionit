/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Text,
  View
} from 'react-native';

import FilterView from './FilterView';
import DataView from './DataView';
import ActionsView from './ActionsView';

import Styles from './Styles';

export default class App extends Component<{}> {
  render() {
    return (
      <View>
        <FilterView style={Styles} />
        <DataView />
        <ActionsView />
      </View>
    );
  }
}
