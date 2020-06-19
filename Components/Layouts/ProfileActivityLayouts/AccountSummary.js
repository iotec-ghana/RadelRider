import React, { Component } from 'react';
import { View, Text } from 'react-native';

class AccountSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View
        style={{
          padding: 20,
          elevation: 10,
          backgroundColor: "#fafafa",
          position: "absolute",
          top: 110,
          borderRadius: 10,
          right: 0,
          left: 0,
          margin: 10,
        }}
      >
        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.5,
              fontSize: 14,
            }}
          >
            Earned Today
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.7,
              fontSize: 22,
            }}
          >
            GHC126.90
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            opacity: 0.1,
          }}
        />
        <View style={{ flexDirection: "row", marginTop: 9 }}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
              }}
            >
              Total Trips
            </Text>
            <Text
              style={{
                fontWeight: "bold",

                fontSize: 15,
              }}
            >
              15
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
              }}
            >
              Time Online
            </Text>
            <Text
              style={{
                fontWeight: "bold",

                fontSize: 15,
              }}
            >
              15h 30m
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
                textAlign: "left",
              }}
            >
              Total Distance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
                textAlign: "left",
              }}
            >
              15 km
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default AccountSummary;
