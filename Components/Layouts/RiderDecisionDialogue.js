import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
const { width, height } = Dimensions.get("window");
export default class RiderDecisionDialogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showmodal: true,
    };
  }
//   accept = (data) => {
//     this.props.yes(data);
//     this.setState({ showmodal: false });
//   };
//   decline = (data) => {
//     this.props.no(data);
//     this.setState({ showmodal: false });
//   };

  render() {
    return (
      <View></View>
    );
  }
}
const styles = StyleSheet.create({
 
});
