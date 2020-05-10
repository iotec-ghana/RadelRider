/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Provider} from 'react-redux';
import store from './store';
import MainActivity from './Components/MainActivity';

const App: () => React$Node = () => {
  console.disableYellowBox = true;
  return (
    <>
      <StatusBar backgroundColor="#e7564c" barStyle="dark-content" />
      <Provider store={store}>
        <MainActivity />
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
