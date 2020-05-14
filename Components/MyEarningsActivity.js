import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import Toolbar from "./Layouts/Toolbar";
const { width, height } = Dimensions.get("window");

export default class MyEarningsActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <Text style={{ fontWeight: "bold", fontSize: 14, opacity: 0.5 }}>
            Wallet Balnce
          </Text>
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
  linechart() {
    return (
      <LineChart
        data={{
          labels: ["S", "M", "T", "W", "T", "F", "S"],
          datasets: [
            {
              data: [
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10,
                Math.random() * 10,
              ],
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={320}
        yAxisLabel=""
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          margin: 10,
          borderRadius: 10,
          position: "absolute",
          bottom: -240,
        }}
      />
    );
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Toolbar
              icon={"chevron-left"}
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
            bottom:-0,
            width:width,
           
           
          }}
        >
          
          </View>
              {this.summary()}

              {this.linechart()}
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
    backgroundColor:"#fff"
  },
});
