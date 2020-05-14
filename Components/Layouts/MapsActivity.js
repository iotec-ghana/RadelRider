/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {Component} from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Polyline,
} from 'react-native-maps';
import Expo from 'expo';
import {PV_API} from '../../constants';
import Toolbar from './Layouts/Toolbar';
import haversine from 'haversine';
import BottomSheetMain from './Layouts/MainMapBottomSheet';
import BottomDrawer from 'rn-bottom-drawer';
import {StackActions} from '@react-navigation/native';
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.015;
const LATITUDE = 0.009;
const LONGITUDE = 0.009;
import {GOOGLE_MAPS_APIKEY} from 'react-native-dotenv';
import Sidebar from './Layouts/Sidebar';
import {Drawer} from 'native-base';
import {getCurrentLocation} from '../../Actions/locationAction';
import {isSignedIn, loginStatus} from '../../Actions/authAction';
import {connect} from 'react-redux';
import {getRiders} from '../../Actions/getAllRidersAction';
import {Toast} from 'native-base';
const TAB_BAR_HEIGHT = -6;
const {width, height} = Dimensions.get('window');
import {Ionicons} from '@expo/vector-icons';
import {
  establishConnectionToSocket,
  getNearbyRiders,
} from '../../socketFunctions';
import * as Location from 'expo-location';
import io from 'socket.io-client';
const socket = io(PV_API, {
  secure: true,
  transports: ['websocket'],
});
import Spinner from 'react-native-loading-spinner-overlay';
class MapsActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: props.origin.latitude,
      longitude: props.origin.longitude,
      bottomSheetHeight: height / 4,
      routeCoordinates: [],
      riders: [],
      distanceTravelled: 0,
      locationName: '',
      showBS: false,
      originName: props.originName,
      bearing: 0,
      speed: 0,
      magnetometer: null,
      time: 'N/A',
      prevLatLng: {},
      coordinateRiders: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      coordinateUser: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
    this.drawer = null;
    this.indx = 0;
  }

  round(n) {
    if (!n) {
      return 0;
    }

    return Math.floor(n * 100) / 100;
  }

  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };
  componentWillUnmount() {
    //this._unsubscribe();
    //Location.clearWatch(this.watchID);
    // console.log("unmounted");
  }
  componentWillMount() {
    this.animatedValue = new Animated.Value(50);
  }
  getAllRiders = () => {
    const userData = {
      userid: 4,     
    };          
    establishConnectionToSocket(userData);
    socket.on('online-riders', riderData => {
      this.setState({
        riders: this.state.riders.filter(
          rider => rider.riderid !== riderData.riderid,
        ), 
      });    
      //console.log()
      this.setState({riders: [...this.state.riders, riderData]});
      this.props.getRiders(this.state.riders);
    });
 
    console.log(this.state.riders);
  };

  componentDidMount = async () => {
    await this.props.loginStatus();
    if (!this.props.authStatus.isAuthenticated) {
      this.props.navigation.dispatch(StackActions.replace('Intro'));
    }

    let {status} = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let pos = await Location.getCurrentPositionAsync({});
    const Oname = await this.getLocationName(pos);
    const data = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      originName: Oname,
      speed: pos.coords.speed,
    };  
    console.log(data);
    //this.subscribe();
    this.setState({bearing: pos.coords.heading});
     
    await this.props.getCurrentLocation(data);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 600,
    }).start();  
    this.setState({showBS: true}); 
    this.getAllRiders();
    this.animateRiderMovement();

    this.watchID = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 10000,
      },
      async position => {
        const {latitude, longitude} = position.coords;
        const Oname = await this.getLocationName(position);
        const newCoordinate = {
          latitude,
          longitude,
          originName: Oname,
        };
        await this.props.getCurrentLocation(newCoordinate);

        try {
          // this.map.animateToRegion(this.getCurrentRegion(), 1000 * 2);

          coordinateUser.timing(newCoordinate).start();
        } catch (error) {
          console.log(error);
        }

        this.setState({
          latitude,
          longitude,
          bearing: position.coords.heading,
        });
      },
      error => console.log(error),
    );
  };

  animateRiderMovement = () => {
    {
      this.state.riders.map(riders =>
        coordinateRiders
          .timing({latitude: riders.latitude, longitude: riders.longitude})
          .start(),
      );
    }
  };
  renderContent = () => {
    return <BottomSheetMain navigation={this.props.navigation} />;
  };
  async getLocationName(position) {
    try {
      const {latitude, longitude} = position.coords;
      const key = GOOGLE_MAPS_APIKEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`;
      const res = await axios.get(url);
      return res.data.results[2].formatted_address;
    } catch (e) {
      console.log(e.message);
      if (e.message === 'Network Error') {
        this.setState({showBS: false});
        Toast.show({
          text: 'Please check your internet connection',
          buttonText: 'Okay',
          duration: 5000,
        });
      }
    }
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('permission denied');
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

  calcDistance = newLatLng => {
    const {prevLatLng} = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  render() {
    // const interpolateRotation = this.animatedValue.interpolate({
    //   inputRange:[0,1],
    //   outputRange:['0deg',`${this.state.bearing}deg`]
    // })
    // const animatedStyle={
    //   transform:[{rotate:interpolateRotation}]
    // }
    return (
      <View style={{flex: 1}}>
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={
            <Sidebar
              navigation={this.props.navigation}
              authdata={this.props.authStatus}
            />
          }>
          <View style={styles.container}>
            {!this.state.showBS ? (
              <Spinner
                visible={true}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            ) : (
              <MapView
                provider={PROVIDER_GOOGLE}
                showUserLocation
                followUserLocation
                region={this.getCurrentRegion()}
                style={{...StyleSheet.absoluteFillObject}}
                ref={ref => {
                  this.map = ref;
                }}>
                <MapView.Marker.Animated
                  ref={marker => {
                    this.markerUser = marker;
                  }}
                  style={{
                    transform: [
                      {
                        rotate:
                          this.state.bearing === undefined
                            ? '0deg'
                            : `${this.state.bearing}deg`,
                      },
                    ],
                  }}
                  coordinate={this.getCurrentRegion()}>
                  {/* <Ionicons
                    name={"md-checkmark-circle"}
                    size={24}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: "contain",
                      // transform: [{ rotate: `${this.state.bearing}deg` }],
                      zIndex: 3,
                    }}
                  /> */}
                </MapView.Marker.Animated>

                {this.state.riders.map(riders => (
                  <Marker.Animated
                    ref={marker => {
                      this.markerRider = marker;
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                      transform: [{rotate: `${riders.bearing}deg`}],
                      zIndex: 3,
                    }}
                    coordinate={{
                      latitude: riders.latitude,
                      longitude: riders.longitude,
                    }}>
                    <Image
                      source={require('../../assets/motor.png')}
                      style={{height: 40, width: 40}}
                    />

                    <Marker
                      coordinate={{
                        latitude: riders.latitude,
                        longitude: riders.longitude,
                      }}
                    />
                  </Marker.Animated>
                ))}
              </MapView>
            )}
            <Toolbar
              icon={'ios-menu'}
              notbackAction={true}
              opendrawer={this.openDrawer}
              navigation={this.props.navigation}
            />
            {this.state.showBS ? (
              <BottomDrawer
                containerHeight={this.state.bottomSheetHeight}
                offset={TAB_BAR_HEIGHT}
                shadow={true}>
                {this.renderContent()}
              </BottomDrawer>
            ) : // <RBSheet
            //   ref={ref => {
            //     this.RBSheet = ref;
            //   }}
            //   height={this.state.bottomSheetHeight}
            //   animationType={'slide'}
            //   duration={650}
            //   minClosingHeight={this.state.bottomSheetHeight}
            //   closeOnPressMask={false}
            //   closeOnPressBack={false}
            //   customStyles={{
            //     container: {},
            //     wrapper: {
            //       backgroundColor: 'transparent',
            //     },
            //   }}>
            //   {this.renderContent()}
            // </RBSheet>
            null}
          </View>
        </Drawer>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  origin: state.locationData.OriginCoordinates,
  error: state.locationData.error,
  authStatus: state.auth,
});
export default connect(
  mapStateToProps,
  {getCurrentLocation, getRiders, isSignedIn, loginStatus},
)(MapsActivity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
