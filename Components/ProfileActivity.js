import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";

import Toolbar from "./Layouts/Toolbar";
const { width, height } = Dimensions.get("window");
import { isSignedIn } from "../Actions/authAction";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import AccountSummary from "./Layouts/ProfileActivityLayouts/AccountSummary";
import OnGoingTrip from "./Layouts/ProfileActivityLayouts/OnGoingTrip";

class ProfileActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
    };
  }

  top() {
    const isVerified = JSON.stringify(this.props.authStatus.isVerified);
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          backgroundColor: "#3d6dfe",

          zIndex: 0,
          height: 200,
          // transform: [
          //   {
          //     rotate: "80deg",
          //   },
          // ],
        }}
      >
        <Image style={styles.image} source={require("../assets/userlogo.png")} />
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text
            style={{
              color: "#fff",
              marginLeft: 10,
              marginTop: 10,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {(this, this.props.authStatus.first_name + " " + this.props.authStatus.last_name)}
          </Text>
          {isVerified ? (
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Tap me!"
              onPress={() =>
                this.props.navigation.navigate("AddVehicleActivity", {
                  token: this.props.authStatus.token,
                })
              }
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  marginTop: 10,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Please tap here to get verified
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            height: 40,
            marginRight: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
            bottom: -0,
            width: width,
          }}
        />
      </View>
    );
  }
  render() {
    console.log(this.props.authStatus.isVerified);

    return (
     
        <ScrollView style={styles.container}>
          <View>
            <Toolbar
              icon={"chevron-left"}
              notbackAction={true}
              opendrawer={this.openDrawer}
              navigation={this.props.navigation}
              titleColor={"#fff"}
              body={"Profile"}
              bg={"#3d6dfe"}
              iconColor={"#fff"}
            />
            <StatusBar barStyle="light-content" backgroundColor={"#3d6dfe"} />
            <View>
              {this.top()}
              <AccountSummary />
              <OnGoingTrip />
              
            </View>
            <Text
              style={{
                textAlign: "left",
                margin: 20,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              No notifications
            </Text>
          </View>
        </ScrollView>
      
    );
  }
}
const mapStateToProps = (state) => ({
  authStatus: state.auth.user,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  { isSignedIn }
)(ProfileActivity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  image: {
    borderColor: "#fff",
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 100,
    backgroundColor: "#fff",
  },

  imageCustomer: {
    borderColor: "#fff",
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 100,
  },
});
