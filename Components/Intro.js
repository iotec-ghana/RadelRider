import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {StatusBarColor} from '../../constants';
const windowWidth = Dimensions.get('window').width;

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={StatusBarColor} barStyle="dark-content" />
        <Image
          source={require('../../assets/deedat.jpg')}
          style={{height: 100, width: 100, borderRadius: 100, marginTop: 40}}
        />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 40,
            marginTop: 0,
            textAlign: 'left',
            fontWeight: 'bold',
            opacity: 0.5,
          }}>
          Radel
        </Text>
        <View style={styles.buttons}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 20,
              marginTop: 0,
              textAlign: 'center',
              fontWeight: 'bold',
              opacity: 0.5,
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
    backgroundColor: '#fff',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    padding: 20,
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
    borderColor: '#e7564c',
    borderWidth: 1,
  },
  loginText: {
    color: '#e7564c',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
