/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { Header, Left, Body, Right, Button, Title } from "native-base";
import { StyleSheet, TouchableOpacity, View, Text, Image,Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import { Switch } from "react-native-switch";
export default class HeaderHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
    };
  }
  render() {
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
                source={require("../../assets/city.jpg")}
              />
            </Button>
          </Left>

          <Body style={{marginLeft:width/3.4}}>
            <Switch
              value={this.state.value}
              onValueChange={(val) => this.setState({ value: val })}
              disabled={false}
              activeText={"Online"}
              inActiveText={"Offline"}
              circleSize={40}
              barHeight={40}
              //circleBorderWidth={3}
              backgroundActive={"#3d6dfe"}
              backgroundInactive={"gray"}
              circleActiveColor={"#fff"}
              circleInActiveColor={"#000000"}
              changeValueImmediately={true}
              renderInsideCircle={() => (
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require("../../assets/motor.png")}
                />
              )} // custom component to render inside the Switch circle (Text, Image, etc.)
              changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
              innerCircleStyle={{
                alignItems: "center",
                justifyContent: "center",
              }} // style for inner animated circle for what you (may) be rendering inside the circle
              outerCircleStyle={{}} // style for outer animated circle
             renderActiveText={false}
              renderInActiveText={true}  
              switchLeftPx={1} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              switchRightPx={6} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
              switchWidthMultiplier={2.2} // multipled by the `circleSize` prop to calculate total width of the Switch
              switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
            />
          </Body>

          <Right>
            <TouchableOpacity
             style={{backgroundColor:"#fff",borderRadius:40,padding:10,elevation:20}}
              // onPress={() =>
              //   //this.props.navigation.navigate(this.props.righSideRoute)
              // }
            >
              <Feather
                name={this.props.icon}
                size={24}
                color="#000"
                style={{ margin: 0 }}
              />
            </TouchableOpacity>
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
    backgroundColor: "#fff",
    width: 50,
    borderWidth: 2,
    borderRadius: 100,
  },
});
