import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Right } from "native-base";

class OnGoingTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          marginTop: 70,
          padding: 15,
          elevation: 10,
          backgroundColor: "#fafafa",
          borderRadius: 10,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <View style={{ margin: 3, flexDirection: "row" }}>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.7,
              fontSize: 12,
            }}
          >
            Ongoing Trip
          </Text>
          <TouchableOpacity style={{ position: "absolute", right: 0 }} >
            <Feather name={"more-vertical"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 9 }}>
          <Image style={styles.imageCustomer} source={require("../../../assets/deedat.jpg")} />
          <Text
            style={{
              margin: 10,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Kwame Nana
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end", margin: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
                margin: 5,
              }}
            >
              5:50pm
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            opacity: 0.1,
          }}
        />

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Feather name={"phone"} size={20} color="#3d6dfe" style={{ margin: 2 }} />
            <Text style={{ margin: 5 }}> Call</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Feather name={"navigation"} size={20} color="#3d6dfe" style={{ margin: 2 }} />
            <Text style={{ margin: 5, fontSize: 16 }}>Navigation</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default OnGoingTrip;
const styles = StyleSheet.create({
  imageCustomer: {
    borderColor: "#fff",
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 100,
  },
});
