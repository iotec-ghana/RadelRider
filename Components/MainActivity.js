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
  Image,
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
} from "react-native-maps";
import Spinner from 'react-native-loading-spinner-overlay';
import haversine from "haversine";
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.015;
const LATITUDE = 0.009;
const LONGITUDE = 0.009;
import Toolbar from "./Layouts/Toolbar";
import { PV_API } from "../constants";
import { Drawer } from "native-base";
import { getCurrentLocation } from "../Actions/locationAction";
import {isSignedIn, loginStatus} from '../Actions/authAction';
import {getRiders} from '../Actions/getAllRidersAction';
import { connect } from "react-redux";
import { Toast } from "native-base";
import * as Location from 'expo-location';
const TAB_BAR_HEIGHT = 0;
const { width, height } = Dimensions.get("window");
import {
  establishConnectionToSocket,
  ListenForRideRequest,
} from "../socketFunctions";
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
      showBS: false,
      customerID: "",
      has_customer: false,
      isAvailable: false,
      originName: props.originName,
      prevLatLng: {},
      bearing: 0,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    };
  }

  componentWillUnmount() {
    console.log("unmounted");
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

  componentDidMount = async () => {
    // await this.props.loginStatus();
    // if (!this.props.authStatus.isAuthenticated) {
    //   this.props.navigation.dispatch(StackActions.replace("Intro"));
    // }

    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let pos = await Location.getCurrentPositionAsync({});
    const Oname = await this.getLocationName(pos);
    const data = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      originName: Oname,            
      speed: pos.coords.speed, 
      bearing: pos.coords.heading, 
    };   
    console.log(data) 
    this.setState({ bearing: pos.coords.heading });
    await this.props.getCurrentLocation(data);
    const broadcastPayload = { 
      ...data,
      riderid: 3, 
    };
    if (!this.state.has_customer) {
      establishConnectionToSocket(broadcastPayload);
      ListenForRideRequest();
    }

    this.watchID = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 10000,
      },
      async (position) => {
        const { latitude, longitude } = position.coords;
        const Oname = await this.getLocationName(position);
        const newCoordinate = {
          latitude,
          longitude,
          originName: Oname,
        };
        await this.props.getCurrentLocation(newCoordinate);

        this.map.animateToRegion(this.getCurrentRegion(), 1000 * 2);

        coordinateUser.timing(newCoordinate).start();

        this.setState({
          latitude,
          longitude,
          bearing: position.coords.heading,
        });
      },
      (error) => console.log(error)
    );
  };

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Permission",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log("permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
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
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          onKmlReady={(results) => console.log(results + "kk")}
          region={this.getCurrentRegion()}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        {/* <Segment /> */}
        {/* <Toolbar /> */}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  origin: state.locationData.OriginCoordinates,
  error: state.locationData.error,
  authStatus: state.auth,
});
export default connect(mapStateToProps, { getCurrentLocation,getRiders, isSignedIn, loginStatus })(MainActivity);
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
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
