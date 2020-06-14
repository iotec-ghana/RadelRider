/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { Header, Left, Body, Right, Button, Toast } from "native-base";
import {
  broadCastLocationChange,
  establishConnectionToSocket,
  disconnect,
} from "../../socketFunctions";
const taskName = "rider-background-location";
import * as Location from "expo-location";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  AsyncStorage,
} from "react-native";
import {
  Online,
  Offline,
  GetOnlineStatus,
} from "../../Actions/OnlineStatusAction";
import { connect } from "react-redux";
import * as TaskManager from "expo-task-manager";
import { Feather } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import { Switch } from "react-native-switch";
class HeaderHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      online: props.onlineStatus,
    };
  }
  async ToggleStatus(online) {
    this.setState({ online: online });
    console.log(online);
    if (online) {
      await this.props.Online(online);
      console.log("done");
    } else {
      await this.props.Offline(online);
    }
  }

  async componentDidMount() {
    await this.props.GetOnlineStatus();
    this.setState({ online: this.props.onlineStatus });
    console.log(this.props.onlineStatus, "from local storage");
    if (this.state.online) {
      if (status === "granted") {
        await Location.startLocationUpdatesAsync(taskName, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    } else {
      try {
        // if (Location.hasStartedLocationUpdatesAsync(taskName)) {
        //   console.log(" locationasync is  active");
        //   await Location.stopLocationUpdatesAsync(taskName);
        //   console.log(" topLocationUpdatesAsync has been stopped");
        // } else {
        //   console.log(" location async is not active");
        // }

        // if (TaskManager.isTaskRegisteredAsync(taskName)) {
        //   console.log("isTaskRegisteredAsync is active");
        //   await TaskManager.unregisterTaskAsync(taskName);
        //   console.log("unregisterAllTasksAsync has executed");
        // } else {
        //   console.log("isTaskRegisteredAsync not active");
        // }
        const resp = await TaskManager.unregisterTaskAsync(taskName);
        console.log(resp);
      } catch (e) {
        console.log(e.message);
      }
      //await TaskManager.unregisterAllTasksAsync();
      //console.log("is off on first load");
    }
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

          <Body style={{ marginLeft: width / 3.4 }}>
            <Switch
              value={this.state.online}
              onValueChange={(val) => this.ToggleStatus(val)}
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
              style={{
                backgroundColor: "#fff",
                borderRadius: 40,
                padding: 10,
                elevation: 20,
              }}
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

const mapStateToProps = (state) => ({
  onlineStatus: state.OnlineStatus.online,
});
export default connect(
  mapStateToProps,
  { Online, Offline, GetOnlineStatus }
)(HeaderHome);
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
TaskManager.defineTask(taskName, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }
  if (data) {
    // const user = await AsyncStorage.getItem('authdata');
    // const data = JSON.parse(user);
    const { locations } = data;
    console.log(locations[0].coords, "bg");
    const read = await AsyncStorage.getItem("onlineStatus");
    const status = JSON.parse(read);
    const readAuthdata = await AsyncStorage.getItem("authdata");
    const authdata = JSON.parse(readAuthdata);
    const riderid = authdata.user.id;
    // console.log(riderid);
    if (status.online) {
      console.log("broadcasting data");
      establishConnectionToSocket({ riderid: riderid });
      broadCastLocationChange({ ...locations[0].coords, riderid: riderid });
      // Toast.show({
      //   text: JSON.stringify(locations),
      //   buttonText: "Okay",
      //   duration: 3000,
      //   type: "warning",
      // });
    } else {
      disconnect({});
    }

    //getCurrentLocation(locations[0].coords)
  }
});
