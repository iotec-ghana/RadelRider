/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import { NavigationContainer,DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileActivity from "./Components/ProfileActivity";
import Register from "./Components/Register";
import * as Font from "expo-font";
import Login from "./Components/Login";
import Intro from "./Components/Intro";
import PhoneVerificationActivity from "./Components/PhoneVerificationActivity";
import { Root } from "native-base";
import GetStartedActivity from "./Components/GetStartedActivity";
import AddVehicleActivity from "./Components/AddVehicleActivity";
import HomeActivity from "./Components/HomeActivity";
import { render } from "react-dom";
const config = {
  animation: "spring",
  config: {
    stiffness: 500,
    damping: 500,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(25, 5, 85)',
  }
}
export default class App extends Component {
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    this.loadAssetsAsync()
  } 

  loadAssetsAsync = async () => {
    await Font.loadAsync({
      Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf'),
     
    })
    this.setState({ fontLoaded: true })
  }
  MainStackScreen() {
    return (
      <MainStack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <MainStack.Screen
          name="Intro"
          component={Intro}
          z
        />
        <MainStack.Screen name="Login"  options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} component={Login} />
        <MainStack.Screen name="SignUp"  options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} component={Register} />
        <MainStack.Screen name="Home"  options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} component={HomeActivity} />
        <MainStack.Screen name="ProfileActivity"  options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} component={ProfileActivity} />
        <MainStack.Screen
          name="AddVehicleActivity"
          component={AddVehicleActivity}
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />

        <MainStack.Screen
          name="PhoneVerificationActivity"
          component={PhoneVerificationActivity}
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />

        <MainStack.Screen
          name="GetStartedActivity"
          component={GetStartedActivity}
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />
      </MainStack.Navigator>
    );
  }
  render() {
    console.disableYellowBox = true;
    if(!this.state.fontLoaded){
      return <Text>loading font</Text>
    }
    else{
    return (
      <Root>
        {/* <StatusBar backgroundColor="#E9665D" barStyle="dark-content" /> */}
        <Provider store={store}>
          <NavigationContainer >
            <RootStack.Navigator mode="modal">
              <RootStack.Screen
                name="Main"
                component={this.MainStackScreen}
                options={{ headerShown: false }}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </Provider>
      </Root>
    );
  }
}
}

const styles = StyleSheet.create({});
