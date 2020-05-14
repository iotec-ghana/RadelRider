/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {RegisterUser} from '../Actions/authAction';
import {connect} from 'react-redux';
const windowWidth = Dimensions.get('window').width;
import Toolbar from './Layouts/Toolbar';
import {StatusBarColor} from '../constants';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      phone: '',
      email: '',
      showPassword: false,
      password: '',
      loading: false,
    };
  }
  toggleSwitch = () => {
    this.setState({showPassword: !this.state.showPassword});
  };
  onFirstnameChange = fname => {
    this.setState({
      fname: fname,
    });
  };
  onLastnameChange = lname => {
    this.setState({
      lname: lname,
    });
  };
  onEmailChange = email => {
    this.setState({email: email});
  };
  onPhoneChange = phone => {
    this.setState({phone: phone});
  };
  onPasswordChange = pass => {
    this.setState({password: pass});
  };
  onSubmit = async () => {
    const {fname, lname, phone, email, password} = this.state;
    if (
      fname === '' ||
      lname === '' ||
      phone === '' ||
      email === '' ||
      password === ''
    ) {
      alert('one or more fields is empty');
    } else if (password.length < 6) {
      alert('password must be 6 characters or more');
    } else if (phone.length < 10) {
      alert('phone number has less than 10 digits');
    } else {
      const check = this.validateEmail(email);
      if (check) {
        this.setState({loading: true});
        const payload = {
          first_name: fname,
          last_name: lname,
          email: email,
          phone_number: phone,
          password: password,
        };

        await this.props.RegisterUser(payload, this.props.navigation);
        this.setState({loading: false});
      } else {
        alert('Email format not valid');
      }
    }
  };
  validateEmail = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          icon={'arrow-left'}
          right={'Log in'}
          rightTextColor={'#e7564c'}
          routeBack={'Home'}
          navigation={this.props.navigation}
          righSideRoute={'Login'}
        />
        <StatusBar backgroundColor={StatusBarColor} barStyle="dark-content" />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 40,
            marginTop: 0,
            marginBottom: 12,
            textAlign: 'left',
            fontWeight: 'bold',
            marginLeft: 30,
            marginRight: 30,
          }}>
          Sign up
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 30, marginRight: 30}}>
          <TextInput
            style={styles.inputf}
            placeholder="First Name"
            onChangeText={text => this.onFirstnameChange(text)}
            // defaultValue={text}
          />
          <TextInput
            style={styles.inputl}
            placeholder="Last Name"
            keyboardType={'email-address'}
            onChangeText={text => this.onLastnameChange(text)}
            // defaultValue={text}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => this.onEmailChange(text)}
          // defaultValue={text}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={text => this.onPhoneChange(text)}
          keyboardType={'number-pad'}
          maxLength={10}
          //defaultValue={text}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => this.onPasswordChange(text)}
          //defaultValue={text}
        />

        {/* <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            // onChangeText={text}
            //defaultValue={text}
          /> */}
        {this.state.loading ? (
          <ActivityIndicator size="large" color="#e7564c" />
        ) : null}
        {!this.props.error == '' ? (
          <View style={styles.error}>
            <Icon name="alert-circle" size={18} color="#e7564c" />
            <Text style={styles.errorText}>{this.props.error}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.SignUpButton}
          onPress={() =>
            // this.props.navigation.navigate('PhoneVerificationActivity')
            this.onSubmit()
          }>
          <Text style={styles.SignUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  authStatus: state.auth.isAuthenticated,
  error: state.auth.error2,
});
export default connect(
  mapStateToProps,
  {RegisterUser},
)(Register);
const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  input: {
    height: 50,
    padding: 10,
    borderColor: '#8f9883',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    borderRadius: 3,
    marginLeft: 30,
    marginRight: 30,
  },
  inputf: {
    height: 50,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    marginRight: 8,
    borderRadius: 3,
    flex: 1,
    borderColor: '#8f9883',
    borderWidth: 1,
    borderRadius: 4,
  },
  inputl: {
    height: 50,
    padding: 10,

    marginBottom: 15,
    borderRadius: 3,
    flex: 1,
    borderColor: '#8f9883',
    borderWidth: 1,
    borderRadius: 4,
  },
  error: {
    flexDirection: 'row',
    marginTop: 7,
    padding: 15,
    borderColor: '#e7564c',
    borderWidth: 2,
    marginLeft: 30,
    marginRight: 30,
  },
  errorText: {
    marginLeft: 8,
    color: '#e7564c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  SignUpButton: {
    marginTop: 10,
    backgroundColor: '#e7564c',
    paddingVertical: 15,
    borderRadius: 3,
    marginLeft: 30,
    marginRight: 30,
  },
  SignUpButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  toolbar: {
    flex: 1,
    width: windowWidth,
    position: 'absolute',
    top: 0,
    elevation: 5,
    backgroundColor: '#00000000',
  },

  toolContent: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
});
