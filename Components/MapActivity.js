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
  Modal,
  AsyncStorage,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
} from "react-native-maps";
import data from "../mapStyle";
import UserMarker from "./Layouts/UserMarker";
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
//import { Toast } from "native-base";
import * as Location from "expo-location";
import Sidebar from "./Layouts/Sidebar";
import HeaderHome from "./Layouts/Header";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import RiderDecisionDialogue from "./Layouts/RiderDecisionDialogue";

const TAB_BAR_HEIGHT = 0; 
const { width, height } = Dimensions.get("window");
import {
  establishConnectionToSocket,
  broadCastLocationChange,
  socket,
} from "../socketFunctions";
import io from "socket.io-client/dist/socket.io";
import Toast from "../AndroidNativeModules/Toast";
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
      showmodal: false,
      reqdetails: null,
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
        Toast.show("please check your internet connection", Toast.SHORT);
      }
    }
  }
  async yes(userRequest) {
    const { first_name, last_name, phone_number } = this.props.authStatus.user;
    this.makeDecision({
      ...userRequest,
      isAvailable: true,
      first_name: first_name,
      last_name: last_name,
      license_number: "34423",
      phone_number: phone_number,
    });

    this.setState({
      has_customer: true,
      customerDetails: userRequest,
      //reqdetails: null,
      showmodal: false,
    });
    console.log(this.state.has_customer);

    //  this.listenForCustomerMovement();
  }
  no(userRequest) {
    this.makeDecision({
      ...userRequest,
      isAvailable: false,
    });
    this.setState({
      has_customer: false,
      customerDetails: null,
      reqdetails: null,
      showmodal: false,
    });
  }
  ListenForRideRequest = () => {
    if (!this.state.has_customer) {
      const riderid = this.props.authStatus.user.id;
      socket.on("listening-for-requests-" + riderid, (userRequest) => {
        this.setState({ showmodal: true, reqdetails: userRequest });
      });
    }
  };
  modal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showmodal}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.tripDetails}>
            <Image
              source={require("../assets/city.jpg")}
              style={styles.thumbnail}
            />
            <View style={styles.metadata}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Deedat Idriss
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                Pickup : Kasoa
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                Drop Off : Kaneshi
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => this.yes(this.state.reqdetails)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => this.no(this.state.reqdetails)}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  reCenter() {
    this.map.animateToRegion(this.getCurrentRegion(), 1000);
    this.setState({ onRegionChange: false });
  }
  componentDidMount = async () => {
    await this.props.loginStatus();
    console.log(this.props.authStatus);
    if (!this.props.authStatus.isAuthenticated) {
      this.props.navigation.dispatch(StackActions.replace("Intro"));
    }
    establishConnectionToSocket({ riderid: this.props.authStatus.user.id });
    // const check = await Location.requestPermissionsAsync()
    // console.log(check)
    
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
      // listen for customer movements
      if (this.state.has_customer) {
        const { customerMovement } = this.state;

        this.state.coordinateCustomer
          .timing({
            customerMovement,
            duration,
          })
          .start();
      }
      let pos = await Location.getCurrentPositionAsync({});
      // const Oname = await this.getLocationName(data);
      const data = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        //originName: Oname,
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
      // alert(JSON.stringify(broadcastPayload));
      // if (!this.state.has_customer) {
      //   broadCastLocationChange(broadcastPayload);
      //   this.ListenForRideRequest();
      // }
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 10000,
      }).start();
      // this.map.animateToViewingAngle(40,1000)

      this.watchID = await Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          // const Oname = await this.getLocationName(position);
          var newCoordinate = {
            latitude,
            longitude,
            accuracy,
            //originName: Oname,
            riderid: this.props.authStatus.user.id,
          };
          // setInterval(function() {
          //   console.log("sf");
          // }, 500);
          await this.props.getCurrentLocation(newCoordinate);
          const duration = 1000;
          // this.map.animateToRegion(this.getCurrentRegion(), 1000 * 2);

          this.state.coordinate
            .timing({
              newCoordinate,
              duration,
            })
            .start();

          const newdata = {
            ...newCoordinate,

            riderid: this.props.authStatus.user.id,
          };
          console.log(newCoordinate);
          broadCastLocationChange(newCoordinate);
          if (!this.state.has_customer) {
            this.ListenForRideRequest();
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
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor={'transparent'} 
        />
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
                //customMapStyle={data}
                onRegionChangeComplete={(changed) => {
                  const currentregion = this.getCurrentRegion();

                  if (
                    currentregion.latitude.toFixed(3) ==
                      changed.latitude.toFixed(3) &&
                    currentregion.longitude.toFixed(3) ==
                      changed.longitude.toFixed(3)
                  ) {
                    this.setState({ onRegionChange: false });
                  } else {
                    this.setState({ onRegionChange: true });
                  }
                }}
                initialRegion={this.getCurrentRegion()}
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
                  <UserMarker />
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
                    style={
                      {
                        // transform: [
                        //   {
                        //     rotate: `${this.state.customerDetails.bearing}deg`,
                        //   },
                        // ],
                      }
                    }
                    coordinate={{
                      latitude: this.state.customerDetails.latitude,
                      longitude: this.state.customerDetails.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                  />
                ) : null}

                {this.state.has_customer ? (
                  <MapViewDirections
                    mode={"DRIVING"}
                    strokeColor="#e7564c"
                    optimizeWaypoints={false}
                    resetOnChange={false}
                    origin={{
                      ...this.props.origin,
                      LONGITUDE_DELTA: 0.9,
                      LATITUDE_DELTA: 0.9,
                    }}
                    destination={{
                      latitude: this.state.customerDetails.latitude,
                      longitude: this.state.customerDetails.longitude,
                    }}
                    strokeWidth={3}
                    strokeColor="#3d6dfe"
                    optimizeWaypoints={true}
                    apikey={GOOGLE_MAPS_APIKEY}
                    onStart={(params) => {
                      console.log(
                        `Started routing between "${params.origin}" and "${
                          params.destination
                        }"`
                      );
                    }}
                    onReady={async (result) => {
                      await this.setState({
                        distance: result.distance,
                        duration: result.duration,
                      });
                      /// this.calculatePrice();
                      // console.log(`Distance: ${result.distance} km`);
                      // console.log(`Duration: ${result.duration} min.`);

                      // this.map.fitToCoordinates(result.coordinates, {
                      //   edgePadding: {
                      //     right: width / 50,
                      //     bottom: height / 50,
                      //     left: width / 50,
                      //     top: height / 50,
                      //   },
                      // });
                      //this.map.animateToViewingAngle(70,1000)
                      // this.map.animateCamera(
                      //   {
                      //     center: this.props.origin

                      //     ,
                      //     pitch: 20,
                      //     heading: 120,
                      //     altitude: 200,
                      //     zoom: 10,
                      //   },
                      //   1000
                      // );
                      this.mapView.animateCamera(
                        {
                          center: {
                            ...this.props.origin,
                            LATITUDE_DELTA: 0.9,
                            LONGITUDE_DELTA: 0.9,
                          },
                          pitch: 29,
                          heading: 50,
                          altitude: 12,
                          zoom: 12,
                        },
                        1000
                      );
                    }}
                    onError={(errorMessage) => {
                      console.log("GOT AN ERROR");
                    }}
                  />
                ) : null}
              </MapView>
            )}
            {/* <Toolbar
              icon={"menu"}
              notbackAction={true}
              opendrawer={this.openDrawer}
              navigation={this.props.navigation}
            /> */}

            {this.state.onRegionChange ? (
              <TouchableOpacity
                onPress={() => {
                  this.reCenter();
                }}
                style={{
                  position: "absolute",
                  bottom: height/20,
                  right: 15,
                  padding: 7,
                  backgroundColor: "#fff",
                  borderRadius: 40,
                  elevation: 84,
                }}
              >
                <FontAwesome5
                  name="crosshairs"
                  size={24}
                  color="#000"
                  style={{ margin: 2 }}
                />
              </TouchableOpacity>
            ) : null}
            <HeaderHome  
              icon={"menu"}
              route={"ProfileActivity"}
              online={true}
              icon={"search"}
              navigation={this.props.navigation}
            />
          </View>
        </Drawer>
        {this.state.showmodal ? this.modal() : null}
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
  modalcontainer: {
    padding: 20,
    elevation: 80,
    borderRadius: 10,
    marginBottom: 60,
    width: width - 20,
    backgroundColor: "#fff",
    marginLeft: 10,
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  tripDetails: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  metadata: {
    padding: 10,
  },

  acceptButton: {
    marginTop: 10,
    backgroundColor: "#3d6dfe",
    paddingVertical: 15,
    borderRadius: 3,
  },
  acceptButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  declineButton: {
    marginTop: 10,
    backgroundColor: "#e7564c",
    paddingVertical: 15,
    borderRadius: 3,
  },
  declineButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
//
