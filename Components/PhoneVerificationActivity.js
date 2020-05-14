/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {isSignedIn} from '../Actions/authAction';
import {connect} from 'react-redux';

import {View} from 'native-base';
import Toolbar from './Layouts/Toolbar';
import axios from 'axios';
import {BaseRouter} from '@react-navigation/native';
import {PV_API, BASE_URL} from '../constants';
const windowWidth = Dimensions.get('window').width;
import InputCode from 'react-native-input-code';
import {StackActions} from '@react-navigation/native';


class PhoneVerificationActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      input: '',
      resendTimeout: 60,
      loadin: false,
    };
  }
  onChangeCode = code => {};
  onFullFill = async code => {
    const authdata = {
      email: this.props.route.params.email,
      password: this.props.route.params.password,
    };
    this.setState({input: code});
    if (this.state.code === code) {
      this.setState({loading: true});

      await this.UpdateVerificationStatus();
      this.setState({loading: false});
      this.props.navigation.dispatch(
        StackActions.replace('GetStartedActivity', {
          user: authdata,
        }),
      );
    } else {
      alert('The verification code you entered is not valid');
    }
  };

  componentDidMount = async () => {
     await this.RequestCode();
  };
  RequestCode = async () => {
    try {
      const response = await axios.post(PV_API + '/verifyPhone', {
        phone: this.props.route.params.phone,
      });
      this.setState({code: response.data.code});
      console.log(response.data.code);
    } catch (e) {
      console.log('err');
    }
  };

  UpdateVerificationStatus = async () => {
    try {
      const config = {
        headers: {Authorization: `Bearer ${this.props.route.params.token}`},
      };

      const response = await axios.put(
        `${BASE_URL}/verifyUser/${this.props.route.params.userid}`,
        {},
        config,
      );
      console.log(response.data);
      //then login
      // this.props.isSignedIn(authdata);
    } catch (e) {
      console.log(e);
      alert('Oops there was a problem');
    }
  };
 
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => {
              if (this.state.code === this.state.input) {
                this.props.navigation.navigate('GetStartedActivity');
              } else {
                alert('The verification code you entered is not valid');
              }
            }}>
            <Text style={styles.setButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
        <Toolbar
          icon={'ios-arrow-back'}
          routeBack={'Home'}
          navigation={this.props.navigation}
          righSideRoute={'Login'}
        />
        <View style={styles.container}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 40,
              marginTop: 0,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            Verify phone number
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 16,
              marginTop: 10,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            Check your SMS messages. We've sent you the PIN at
            {this.props.route.params.phone}
          </Text>
          <InputCode
            style={{marginTop: 20}}
            ref={ref => (this.inputCode = ref)}
            length={4}
            onChangeCode={this.onChangeCode}
            onFullFill={this.onFullFill}
            passcode
            passcodeChar="*"
            codeContainerStyle={{
              borderWidth: 0,
              borderBottomWidth: 2,
              padding: 20,
              borderBottomColor: 'red',
            }}
            codeContainerCaretStyle={{
              borderWidth: 0,

              borderBottomWidth: 2,
              borderBottomColor: 'green',
            }}
            autoFocus
          />

          {/* const pollingID = setInterval(() => {
                this.checkPaymentStatus(pid.paymentID);
                if (this.state.hasPaid) {
                  clearInterval(pollingID);
                }
              }, 4000); */}

          <View style={{flexDirection: 'row', marginTop: 40}}>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontSize: 13,
                textAlign: 'left',
                padding: 2,
              }}>
              Didnt receive SMS?
            </Text>
            <TouchableOpacity
              onPress={() => this.RequestCode()}
              style={{margin: 2}}>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 13,

                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#e7564c',
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.loading ? (
            <Image
              source={require('../assets/spinner.gif')}
              style={{
                height: 200,
                width: 200,
                marginTop: 40,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            /> 
          ) : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    width: windowWidth,
  },
  root: {flex: 1},

  codeFiledRoot: {marginTop: 30},
  cell: {
    width: windowWidth / 5,
    height: 50,
    lineHeight: 50,
    fontSize: 54,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    padding: 10,
  },
  focusCell: {
    borderColor: '#2bb234',
  },
  button: {
    width: windowWidth,
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  setButton: {
    margin: 10,
    backgroundColor: '#e7564c',
    paddingVertical: 15,
    borderRadius: 2,
  },
  setButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
const mapStateToProps = state => ({
  authStatus: state.auth.isAuthenticated,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  {isSignedIn},
)(PhoneVerificationActivity);
