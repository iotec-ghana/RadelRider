import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Settings from '../Settings';
const DrawerC = createDrawerNavigator();

export default class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigationContainer>
        <DrawerC.Navigator initialRouteName="Intro">
          <DrawerC.Screen name="Intro" component={Settings} />
          <DrawerC.Screen name="Notifications" component={Settings} />
        </DrawerC.Navigator>
      </NavigationContainer>
    );
  }
}
