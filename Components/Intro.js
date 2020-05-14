import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {StatusBarColor} from '../constants';
import {loginStatus} from '../Actions/authAction';
import {connect} from 'react-redux';
import {StackActions} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    //props.loginStatus();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="dark-content"
        />
        <Image
          source={require('../assets/city.jpg')}
          style={[
            StyleSheet.absoluteFill,
            {
              // Temporary Workaround:
              // Current (imperfect yet) implementation of <Image> overwrites width and height styles
              // (which is not quite correct), and these styles conflict with explicitly set styles
              // of <ImageBackground> and with our internal layout model here.
              // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
              // This workaround should be removed after implementing proper support of
              // intrinsic content size of the <Image>.
              width: windowWidth.width,
              height: windowWidth.height,
            },
          ]}
        />
        <Image
          source={require('../assets/logo.png')}
          style={{height: 100, width: 100, borderRadius: 100, marginTop: 40}}
        />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 40,
            marginTop: 0,
            textAlign: 'left',
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Radel Rider
        </Text>
        <View style={styles.buttons}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 20,
              marginTop: 0,
              textAlign: 'center',
              fontWeight: 'bold',

              color: '#fff',
            }}>
            An Easy, Reliable and quick way to get items around
          </Text>
          <TouchableOpacity
            style={styles.signup}
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>Sign Up </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.login}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  authStatus: state.auth,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  {loginStatus},
)(Intro);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#ff8900",
    alignItems: 'center',
    backgroundColor: '#fff',
    width: windowWidth,
  },
  buttons: {
    width: windowWidth,
    backgroundColor: '#00000000',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    padding: 40,
  },

  signup: {
    backgroundColor: '#e7564c',
    paddingVertical: 15,
    borderRadius: 3,
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',

    fontSize: 16,
  },
  login: {
    paddingVertical: 15,
    borderRadius: 3,
    marginTop: 10,
    // borderColor: '#e7564c',
    // borderWidth: 1,
    backgroundColor: '#fff',
  },
  loginText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
