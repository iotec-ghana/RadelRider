import React, { Component } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, ScrollView } from "react-native";

import Toolbar from "./Layouts/Toolbar";
const { width, height } = Dimensions.get("window");
//import ChartTheme from './Themes/ChartTheme';
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
const data = [
  { day: "S", earnings: 1300 },
  { day: "M", earnings: 1650 },
  { day: "T", earnings: 1425 },
  { day: "W", earnings: 2190 },
  { day: "TH", earnings: 1950 },
  { day: "F", earnings: 1900 },
  { day: "SA", earnings: 1900 },
];

export default class MyEarningsActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    //this.props.navigation.setOptions({ headerTitle:this.props=> <Toolbar {...this.props}/>})
    //console.log(this.props.navigation)
  }
  summary() {
    return (
      <View
        style={{
          padding: 15,
          elevation: 24,
          backgroundColor: "#fafafa",
          position: "absolute",
          top: 0,
          width: width - 20,
          flexDirection: "row",
          margin: 10,
          borderRadius: 10,
        }}
      >
        <View style={{ margin: 4 }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, opacity: 0.5 }}>Wallet Balnce</Text>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>GHC70.00</Text>
        </View>

        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            alignItem: "flex-end",
            paddingVertical: 10,
            backgroundColor: "#3d6dfe",
            borderRadius: 4,
            position: "absolute",
            right: 0,
            width: width / 2.5,
            margin: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Toolbar
             
              notbackAction={true}
              opendrawer={this.openDrawer}
              navigation={this.props.navigation}
              titleColor={"#fff"}
              body={"My Earnings"}
              bg={"#3d6dfe"}
              iconColor={"#fff"}
            />
            <StatusBar barStyle="light-content" backgroundColor={"#3d6dfe"} />

            <View
              style={{
                flexDirection: "row",
                padding: 20,
                backgroundColor: "#3d6dfe",

                zIndex: 0,
                height: 200,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  height: 40,
                  marginRight: 10,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  position: "absolute",
                  bottom: 0,
                  width: width,
                }}
              />
              {this.summary()}
              <View
                style={{
                  backgroundColor: "#fff",
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 110,
                  elevation: 40,
                  borderRadius: 12,
                  margin: 10,
                }}
              >
                <View style={{padding:10}}>
                <Text style={{fontSize:15}}>Wallet balance</Text>
                <Text style={{fontSize:12,fontWeight:"bold"}}>GHC7000</Text>
                </View>
                <VictoryChart width={width} theme={VictoryTheme.material}>
                  <VictoryBar data={data} x="day" y="earnings" />
                </VictoryChart>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: "#fff",
  },
});
