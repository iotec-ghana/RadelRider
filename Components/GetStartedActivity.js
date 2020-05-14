/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import { StatusBarColor } from "../constants";
const windowWidth = Dimensions.get("window").width;
import { isSignedIn } from "../Actions/authAction";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
class GetStartedActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(props, state) {
    if (props.authStatus) {
      // props.navigation.navigate('Login');
      props.navigation.dispatch(StackActions.replace("Main"));
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={StatusBarColor} barStyle="dark-content" />
        <Feather
          name="check-circle"
          size={120}
          color="#000"
          style={{ margin: 2 }}
        />
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>
          You are ready to go
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {" "}
          Thanks for taking your time to create an {"\n"} account with us. Now
          this is the fun part, {"\n"} let's explore the app
        </Text>

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() =>
              // this.props.navigation.dispatch(StackActions.replace('Login'))
              //console.log("sdf")
              this.props.isSignedIn(this.props.route.params.user)
            }
          >
            <Text style={styles.setButtonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    width: windowWidth / 2,
    marginTop: 30,
  },
  setButton: {
    margin: 10,
    backgroundColor: "#222846",
    paddingVertical: 15,
    borderRadius: 2,
  },
  setButtonText: {
    color: "#e7564c",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
const mapStateToProps = (state) => ({
  authStatus: state.auth.isAuthenticated,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  { isSignedIn }
)(GetStartedActivity);
