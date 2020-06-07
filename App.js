import React, { Component } from "react";
import { View, Text } from "react-native";
import rootComponent from "./Components/RootComponent";
import { Provider } from "react-redux";
import store from "./store";
import { Root } from "native-base";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Root>
        <Provider store={store}>
          <RootComponent />
        </Provider>
      </Root>
    );
  }
}
