import React, { Component } from "react";
import axios from "axios";
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
  Alert,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
} from "react-native-maps";
import UserMarker from './Layouts/UserMarker';
import Spinner from "react-native-loading-spinner-overlay";
import haversine from "haversine";
import MapViewDirections from "react-native-maps-directions";
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.015;
const LATITUDE = 0.009;
const LONGITUDE = 0.009;
import { StackActions } from "@react-navigation/native";
import Toolbar from "./Layouts/Toolbar";
import { PV_API } from "../constants";
import { GOOGLE_MAPS_APIKEY } from "react-native-dotenv";
import { Drawer } from "native-base";
import { getCurrentLocation } from "../Actions/locationAction";
import { isSignedIn, loginStatus } from "../Actions/authAction";
import { getRiders } from "../Actions/getAllRidersAction";
import { connect } from "react-redux";
import { Toast } from "native-base";
import * as Location from "expo-location";
import Sidebar from "./Layouts/Sidebar";
import HeaderHome from "./Layouts/Header";
import { Feather } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 0;
const { width, height } = Dimensions.get("window");
import {
  establishConnectionToSocket,
  ListenForRideRequest,
  makeDecision,
  disconnect,
} from "../socketFunctions";
import io from "socket.io-client";
const socket = io(PV_API, {
  secure: true,
  transports: ["websocket"],
});
class MainActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: props.origin.latitude,
      longitude: props.origin.longitude,
      bottomSheetHeight: height / 4,
      routeCoordinates: [],
      distanceTravelled: 0,
      locationName: "",
      customerID: "",
      has_customer: false,
      isAvailable: false,
      loading: true,
      customerDetails: null,
      customerMovement: null,
      originName: props.originName,
      prevLatLng: {},
      bearing: 0,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
      coordinateCustomer: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    };
  }

  componentWillUnmount() {
    //disconnect({ riderid: this.props.authStatus.user.id, rider: true });
    console.log("unmounted");
  }
  listenForCustomerMovement() {
    console.log("dsfsdf" + this.state.customerDetails);
    socket.on(
      "customer-movement-" + this.state.customerDetails.userid,
      (movement) => {
        this.setState({ customerMovement: movement });
      }
    );
  }
  makeDecision(decisionObj) {
    socket.emit("request-decision", decisionObj);
    console.log("Responded");
  }
  componentWillMount() {
    this.animation = new Animated.Value(0);
  }
  async getLocationName(position) {
    try {
      const { latitude, longitude } = position.coords;
      const key = "AIzaSyCWNecG4xgKaW3_RGqgGT5QZnk9knUesCA";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;
      const res = await axios.get(url);
      return res.data.results[2].formatted_address;
    } catch (e) {
      console.log(e.message);
      if (e.message === "Network Error") {
        this.setState({ showBS: false });
        Toast.show({
          text: "Please check your internet connection",
          buttonText: "Okay",
          duration: 5000,
        });
      }
    }
  }
  async yes(userRequest) {
    this.makeDecision({
      ...userRequest,
      isAvailable: true,
    });
    console.log(userRequest);
    await this.setState({ has_customer: true, customerDetails: userRequest });
    //  this.listenForCustomerMovement();
  }
  no(userRequest) {
    this.makeDecision({
      ...userRequest,
      isAvailable: false,
    });
  }
  ListenForRideRequest() {
    const riderid = this.props.authStatus.user.id;
    socket.on("listening-for-requests-" + riderid, (userRequest) => {
      console.log(userRequest);
      Alert.alert(
        "You got a passenger",
        `pickup: ${userRequest.pickup}\nDropoff:${userRequest.destination}`,
        [
          {
            text: "Decline",
            onPress: () => this.no(userRequest),
            style: "cancel",
          },
          {
            text: "Accept",
            onPress: () => this.yes(userRequest),

            // tracking()t
          },
        ],
        { cancelable: false }
      );
    });
  }
  componentDidMount = async () => {
    await this.props.loginStatus();
    if (!this.props.authStatus.isAuthenticated) {
      this.props.navigation.dispatch(StackActions.replace("Intro"));
    }

    // const check = await Location.requestPermissionsAsync()
    // console.log(check)
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let pos = await Location.getCurrentPositionAsync({});
      const Oname = await this.getLocationName(data);
      const data = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        originName: Oname,
        speed: pos.coords.speed,
        bearing: pos.coords.heading,
      };

      console.log(data);

      await this.props.getCurrentLocation(data);
      this.setState({ bearing: pos.coords.heading, loading: false });
      const broadcastPayload = {
        ...data,
        riderid: this.props.authStatus.user.id,
      };

      if (!this.state.has_customer) {
        establishConnectionToSocket(broadcastPayload);
        this.ListenForRideRequest();
      }
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 10000,
      }).start();

      this.watchID = await Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          distanceInterval: 1,
          timeInterval: 100,
        },
        async (position) => {
          const { latitude, longitude } = position.coords;
          const Oname = await this.getLocationName(position);
          var newCoordinate = {
            latitude,
            longitude,
            originName: Oname,
          };
          // setInterval(function() {
          //   console.log("sf");
          // }, 500);
          await this.props.getCurrentLocation(newCoordinate);
          const duration = 1000;
          this.map.animateToRegion(this.getCurrentRegion(), 1000 * 2);
          if (Platform.OS === "android") {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(
                newCoordinate,
                duration
              );
            }
          } else {
            this.state.coordinate
              .timing({
                newCoordinate,
                duration,
              })
              .start();
          }

          // listen for customer movements
          if (this.state.has_customer) {
            const { customerMovement } = this.state;
            if (Platform.OS === "android") {
              if (this.markerCustomer) {
                this.markerCustomer._component.animateMarkerToCoordinate(
                  customerMovement,
                  duration
                );
              }
            } else {
              this.state.coordinateCustomer
                .timing({
                  customerMovement,
                  duration,
                })
                .start();
            }
          }
          //this.state.coordinate.timing(newCoordinate).start();

          this.setState({
            latitude,
            longitude,
            bearing: position.coords.heading,
          });
        },
        (error) => console.log(error)
      );
    } catch (e) {
      console.log(e);
    }
  };
  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };

  getCurrentRegion = () => ({
    latitude: this.state.latitude, 
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
 
  calcDistance = (newLatLng) => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };  

  render() {
    const { has_customer } = this.state;
    if (has_customer) {
      const { latitude, longitude } = this.state.customerDetails;
    }
    return (
      <View style={{ flex: 1 }}>
       
        <Drawer
          ref={(ref) => {
            this.drawer = ref;
          }}
          content={
            <Sidebar
              navigation={this.props.navigation}
              authdata={this.props.authStatus}
            />
          }
        >
          <View style={styles.container}>
            {this.state.loading ? (
              <Spinner
                visible={true}
                textContent={"Loading..."}
                textStyle={styles.spinnerTextStyle}
              />
            ) : (
              <MapView
                provider={PROVIDER_GOOGLE}
                showUserLocation
                followsUserLocation={false}
                region={this.getCurrentRegion()}
                //onRegionChange={this.getCurrentRegion()}
                style={{ ...StyleSheet.absoluteFillObject }}
                ref={(ref) => {
                  this.map = ref;
                }}
              >
                <MapView.Marker.Animated
                  ref={(marker) => {
                    this.markerUser = marker;
                  }}
                  style={
                    {
                      // transform: [
                      //   {
                      //     rotate:
                      //       this.state.bearing === undefined
                      //         ? "0deg"
                      //         : `${this.state.bearing}deg`,
                      //   },
                      // ],
                    }
                  }
                  coordinate={this.getCurrentRegion()}
                >
                 <UserMarker/>
                  {/* <Animated.View style={styles.marker}>
                    <View style={styles.dot} />
                    <View style={styles.pulse} />
                  </Animated.View> */}

                  {/* <Animated.View style={[styles.markerWrap]}>
                    <Animated.View style={[styles.ring]} />
                    <View style={styles.marker} />
                  </Animated.View> */}
                 
                </MapView.Marker.Animated>
                 {this.state.has_customer ? (
                    <Marker.Animated
                      ref={(marker) => {
                        this.markerCustomer = marker;
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: "contain",
                        // transform: [
                        //   {
                        //     rotate: `${this.state.customerDetails.bearing}deg`,
                        //   },
                        // ],
                        zIndex: 3,
                      }}
                      coordinate={{
                        latitude: this.state.customerDetails.latitude,
                        longitude: this.state.customerDetails.longitude,
                      }}
                    >
                      <Marker
                        coordinate={
                          this.state.customerDetails.DestinationCoordinates
                        }
                      />
                    </Marker.Animated> 
                  ) : null}
 
                {this.state.has_customer && (
                  <MapViewDirections
                    origin={this.props.origin}
                    destination={{
                      latitude: this.state.customerDetails.latitude,
                      longitude: this.state.customerDetails.longitude,
                    }}
                    strokeWidth={3}
                    strokeColor="#e7564c" 
                    optimizeWaypoints={true}
                    apikey={GOOGLE_MAPS_APIKEY}
                    onStart={(params) => {
                      // console.log(
                      //   `Started routing between "${params.origin}" and "${
                      //     params.destination
                      //   }"`,
                      // );
                    }}
                    onReady={async (result) => {
                      await this.setState({
                        distance: result.distance,
                        duration: result.duration,
                      });
                      /// this.calculatePrice();
                      // console.log(`Distance: ${result.distance} km`);
                      // console.log(`Duration: ${result.duration} min.`);

                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: width / 50,
                          bottom: height / 50,
                          left: width / 50,
                          top: height / 50,
                        },
                      });
                    }}
                    onError={(errorMessage) => {
                      console.log("GOT AN ERROR");
                    }}
                  />
                )}
              </MapView>
            )}

            {/* <HeaderHome
              icon={"menu"}
              route={"ProfileActivity"}
              online={true}
              icon={"search"}
              navigation={this.props.navigation}
            /> */}
          </View>
        </Drawer>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  origin: state.locationData.OriginCoordinates,
  error: state.locationData.error,
  authStatus: state.auth,
});
export default connect(
  mapStateToProps,
  { getCurrentLocation, getRiders, isSignedIn, loginStatus }
)(MainActivity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  marker: {
    position: "relative",
  },
  pulse: {
    width: 10,
    height: 10,
    borderWidth: 15,
    borderColor: "#7fd2e6",
    borderRadius: 30,
    backgroundColor: "#00a6cd",
    zIndex: 10,
    position: "absolute",
  },
  dot: {
    position: "absolute",
    height: 50,
    width: 50,

    zIndex: 2,
    opacity: 0,
    borderWidth: 10,
    borderColor: "#938275",
    backgroundColor: "#00000000",
  },

  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,

    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(13,64,150, 0.5)",
  },
});
//
