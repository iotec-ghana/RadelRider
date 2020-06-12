/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { Header, Left, Body, Right, Button, Title } from "native-base";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  AsyncStorage,
} from "react-native";
import RNExitApp from 'react-native-exit-app';
import Icon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
import { Switch } from "react-native-switch";
export default class HeaderHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      online: false,
    };
  }
  async ToggleStatus(v) {
    console.log(v);
    const { online, value } = this.state;
    if (v == true) {
      await AsyncStorage.setItem(
        "onlineStatus",
        JSON.stringify({ online: true })
      );
      this.setState({ online: true, value: true });
    } else {
      await AsyncStorage.setItem(
        "onlineStatus",
        JSON.stringify({ online: false })
      );
      this.setState({ online: false, value: false });
    }
    console.log(await AsyncStorage.getItem("onlineStatus"));
  }
  async PersistOnlineStatus() {
    try {
      const check = await AsyncStorage.getItem("onlineStatus");

      if (check == null) {
        await AsyncStorage.setItem(
          "onlineStatus",
          JSON.stringify({ online: false })
        );
        this.setState({ online: false });
      } else {
        const read = await AsyncStorage.getItem("onlineStatus");
        const status = JSON.parse(read);
        this.setState({ online: status.online, value: status.online });
      }
    } catch (error) {}
  }
  // componentDidUpdate(){
  //   this.backgroundLocation();
  // }
  
  async componentDidMount() {
    await this.PersistOnlineStatus();
    console.log(this.state.online, "checked");
    //if (this.state.value == true) {
      this.backgroundLocation();
   // }
  } 
  backgroundLocation() {
    const { online, value } = this.state;
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: "Background tracking",    
      notificationText: "enabled",
      debug: true, 
      startOnBoot: true,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: true,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar",
      },
      // customize post properties
      // postTemplate: {
      //   lat: '@latitude',
      //   lon: '@longitude',
      //   foo: 'bar' // you can also add your own properties
      // }
    });

    BackgroundGeolocation.on("location", (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      console.log(location, "this");
      BackgroundGeolocation.startTask((taskKey) => {
       
        // execute long running task

        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    // BackgroundGeolocation.on("stationary", (stationaryLocation) => {
    //   // handle stationary locations here
    //   Actions.sendLocation(stationaryLocation);
    // });

    BackgroundGeolocation.on("error", (error) => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.log("[INFO] BackgroundGeolocation service has been started");
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[INFO] BackgroundGeolocation service has been stopped");
    });
  
    BackgroundGeolocation.on("authorization", (status) => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "App requires location tracking permission",
              "Would you like to open app settings?",
              [
                {
                  text: "Yes",
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
              ]
            ),
          1000
        );
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
      if(!online){
          BackgroundGeolocation.stop()
          RNExitApp.exitApp();
        }
    }); 
 
    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });

    BackgroundGeolocation.on("abort_requested", () => {
      console.log("[INFO] Server responded with 285 Updates Not Required");

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on("http_authorization", () => {
      console.log("[INFO] App needs to authorize the http requests");
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        "[INFO] BackgroundGeolocation service is running",
        status.isRunning
      );
      console.log(
        "[INFO] BackgroundGeolocation services enabled",
        status.locationServicesEnabled
      );
      console.log(
        "[INFO] BackgroundGeolocation auth status: " + status.authorization
      );
 
      // you don't need to check status before start (this is just the example)
      if (online) {
        BackgroundGeolocation.start(); //triggers start on start event
      } 
      // 
    });    
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
