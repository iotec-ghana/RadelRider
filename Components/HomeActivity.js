import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MapActivity from "./MapActivity";
import MyEarningsActivity from "./MyEarningsActivity";
import SettingsActivity from "./SettingsActivity";
import Toolbar from "./Layouts/Toolbar";
import ProfileActivity from "./ProfileActivity";
const Tab = createMaterialBottomTabNavigator();
export default class HomeActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    
  }
  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "compass" : "compass";
            } else if (route.name === "Earnings") {
              iconName = focused ? "bar-chart-2" : "bar-chart-2";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings";
            } else if (route.name === "Profile") {
              iconName = focused ? "user" : "user";
            }

            // You can return any component that you like here!
            return <Feather name={iconName} size={24} color={color} />;
          },
        })}
        //labeled={false}
        activeColor="#3d6dfe"
        inactiveColor="gray"
        barStyle={{ backgroundColor: "#fff" }}
      >
        <Tab.Screen
          name="Home"
          component={MapActivity}
          options={{
            title: "Home",
          }}
        />
        <Tab.Screen name="Earnings"  options={{ headerTitle: props => <Toolbar {...props} /> }} component={MyEarningsActivity} />
        <Tab.Screen name="Settings" component={SettingsActivity} />
      </Tab.Navigator>
    );
  }
}
//#f7f9fc
