import React, { Component } from "react";
import { View, Text } from "react-native";
import RootComponent from "./Components/RootComponent";
import { Provider } from "react-redux";
import store from "./store";
import { Root } from "native-base";

import * as Font from "expo-font";
//BackgroundFetch.setMinimumIntervalAsync(2);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }
  async componentDidMount() {
    await this.loadAssetsAsync();
    //.backgroundLocation() 
   
  }


  loadAssetsAsync = async () => {
    await Font.loadAsync({
      Roboto_medium: require("./assets/fonts/Roboto-Medium.ttf"),
    });
    this.setState({ fontLoaded: true });
  };
  render() {
    console.disableYellowBox = true;
    if (!this.state.fontLoaded) {
      return <Text>loading font</Text>;
    } else {
    return (
      <Root>
        <Provider store={store}>
          <RootComponent />
        </Provider>
      </Root>
    );
    }
  }
}

