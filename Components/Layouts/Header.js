/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { Header, Left, Body, Right, Button, Title } from "native-base";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";

export default class HeaderHome extends Component {
  render() {
    const img = "../../assets/deedat.jpg";
    return (
      <View style={styles.header}>
        
        <Header transparent>
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate(this.props.route);
              }}
            >
              {/* <Feather
                name={this.props.icon}
                size={30}
                color="#000"
                style={{margin: 0}}
              /> */}

              {/* <Text>Back</Text> */}
              <Image
                style={styles.image}
                source={require("../../assets/userlogo.png")}
              />
            </Button>
          </Left>

          <Body>
            {this.props.online ? (
              <Title
                style={{
                  color: "green",
                  margin: 0,
                }}
              >
                Online
              </Title>
            ) : (
              <Title
                style={{
                  color: "#000",
                  margin: 0,
                }}
              >
                Offline
              </Title>
            )}
          </Body>

          <Right>
            <Button
              transparent
              // onPress={() =>
              //   //this.props.navigation.navigate(this.props.righSideRoute)
              // }
            >
              <Feather
                name={this.props.icon}
                size={30}
                color="#000"
                style={{ margin: 0 }}
              />
            </Button>
          </Right>
        </Header>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    elevation: 12,
    backgroundColor: "#f7f9fc",
    paddingTop: 0,
  },
  image: {
    borderColor: "#00000000",
    height: 50,
    backgroundColor:"#fff",
    width: 50,
    borderWidth: 2,
    borderRadius: 100,
  },
});
