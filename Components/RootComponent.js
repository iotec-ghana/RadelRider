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
import * as Location from "expo-location";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileActivity from "./ProfileActivity";
import Register from "./Register";
import * as Font from "expo-font";
import Login from "./Login";
import Intro from "./Intro";
import PhoneVerificationActivity from "./PhoneVerificationActivity";
import GetStartedActivity from "./GetStartedActivity";
import AddVehicleActivity from "./AddVehicleActivity";
import HomeActivity from "./HomeActivity";
import { render } from "react-dom";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import {
  establishConnectionToSocket,
  broadCastLocationChange,
} from "../socketFunctions";
BackgroundFetch.setMinimumIntervalAsync(2);
const taskName = "test-background-fetch";
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
    primary: "rgb(25, 5, 85)",
  },
};
class RootComponent extends Component {
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    this.loadAssetsAsync();
    // this.registerTaskAsync();
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(taskName, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
  registerTaskAsync = async () => {
    await BackgroundFetch.registerTaskAsync(taskName);
    console.log("task registered");

    const status = await BackgroundFetch.getStatusAsync();

    switch (status) {
      case BackgroundFetch.Status.Restricted:
        alert("Restrict");
        break;
      case BackgroundFetch.Status.Denied:
        alert("Background execution is disabled");
        break;

      case BackgroundFetch.Status.Available:
        alert("Avaible");
        break;

      default: {
        alert("Background execution allowed");

        let tasks = await TaskManager.getRegisteredTasksAsync();
        if (tasks.find((f) => f.taskName === taskName) == null) {
          alert("Registering task");
          await BackgroundFetch.registerTaskAsync(taskName);

          tasks = await TaskManager.getRegisteredTasksAsync();
          alert("Tanımlananlar", tasks);
        } else {
          alert(`Task ${taskName} already registered, skipping`);
        }

        await BackgroundFetch.setMinimumIntervalAsync(2);

        break;
      }
    }
  };
  loadAssetsAsync = async () => {
    await Font.loadAsync({
      Roboto_medium: require("../assets/fonts/Roboto-Medium.ttf"),
    });
    this.setState({ fontLoaded: true });
  };
  MainStackScreen() {
    return (
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <MainStack.Screen name="Intro" component={Intro} z />
        <MainStack.Screen
          name="Login"
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          component={Login}
        />
        <MainStack.Screen
          name="SignUp"
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          component={Register}
        />
        <MainStack.Screen
          name="Home"
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          component={HomeActivity}
        />
        <MainStack.Screen
          name="ProfileActivity"
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          component={ProfileActivity}
        />
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
    if (!this.state.fontLoaded) {
      return <Text>loading font</Text>;
    } else {
      return (
        <NavigationContainer>
          <RootStack.Navigator mode="modal">
            <RootStack.Screen
              name="Main"
              component={this.MainStackScreen}
              options={{ headerShown: false }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      );
    }
  }
}
export default RootComponent;
const styles = StyleSheet.create({});

TaskManager.defineTask(taskName, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations);
    // do something with the locations captured in the background
  }
});
